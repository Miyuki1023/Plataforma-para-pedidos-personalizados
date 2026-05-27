const pool = require('../config/db');

// Ayudante: Calcular total desde items
const calculateTotal = async (items) => {
  let total = 0;
  for (const item of items) {
    const result = await pool.query(
      'SELECT precio FROM producto WHERE id = $1',
      [item.producto_id]
    );
    if (result.rows.length > 0) {
      const basePrice = Number(result.rows[0].precio);
      const additionalPrice = item.opciones_adicionales || 0;
      total += (basePrice + additionalPrice) * item.cantidad;
    }
  }
  return total;
};

// Crear pedido desde carrito
exports.createOrderFromCart = async (userId, { id_direccion, direccion_manual, observaciones, id_trabajador_asignado }) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Obtener carrito del usuario
    const cartResult = await client.query(
      'SELECT id FROM carrito WHERE usuario_id = $1',
      [userId]
    );

    if (cartResult.rows.length === 0) {
      throw new Error('Carrito no encontrado');
    }

    const cartId = cartResult.rows[0].id;

    // Obtener items del carrito
    const itemsResult = await client.query(
      `SELECT id, producto_id, cantidad, opciones, precio_unitario
       FROM carrito_item WHERE carrito_id = $1`,
      [cartId]
    );

    if (itemsResult.rows.length === 0) {
      throw new Error('El carrito está vacío');
    }

    const items = itemsResult.rows;

    // Validar dirección
    if (id_direccion) {
      const addressCheck = await client.query(
        'SELECT id FROM direccion WHERE id = $1 AND id_usuario = $2',
        [id_direccion, userId]
      );

      if (addressCheck.rows.length === 0) {
        throw new Error('Dirección no encontrada o no pertenece al usuario');
      }
    }

    // Validar trabajador si fue asignado
    if (id_trabajador_asignado) {
      const workerCheck = await client.query(
        'SELECT id_rol FROM usuario WHERE id = $1 AND (id_rol = 2 OR id_rol = 3)',
        [id_trabajador_asignado]
      );

      if (workerCheck.rows.length === 0) {
        throw new Error('Trabajador no encontrado o rol inválido');
      }
    }

    // Calcular total
    let total = 0;
    for (const item of items) {
      const subtotal = Number(item.precio_unitario) * item.cantidad;
      total += subtotal;
    }

    // Crear pedido
    const orderResult = await client.query(
      `INSERT INTO pedido (
        id_cliente, id_direccion, direccion_manual, 
        total, estado_pedido, id_trabajador_asignado, fecha_creacion
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id_pedido, id_cliente, id_direccion, direccion_manual, 
                 total, estado_pedido, id_trabajador_asignado, fecha_creacion`,
      [userId, id_direccion || null, direccion_manual || null, total, 'pendiente', id_trabajador_asignado || null]
    );

    const order = orderResult.rows[0];

    // Insertar detalles del pedido
    for (const item of items) {
      const subtotal = Number(item.precio_unitario) * item.cantidad;
      
      const detailResult = await client.query(
        `INSERT INTO detalle_pedido (
          id_pedido, id_producto, cantidad, subtotal, observaciones
        ) VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [order.id_pedido, item.producto_id, item.cantidad, subtotal, observaciones || null]
      );

      const detailId = detailResult.rows[0].id;

      // Insertar opciones si existen
      if (item.opciones && typeof item.opciones === 'object') {
        const optionIds = Object.values(item.opciones);
        
        for (const optionId of optionIds) {
          await client.query(
            `INSERT INTO detalle_pedido_opcion (id_detalle, id_opcion)
             VALUES ($1, $2)`,
            [detailId, optionId]
          );
        }
      }
    }

    // Limpiar carrito
    await client.query(
      'DELETE FROM carrito_item WHERE carrito_id = $1',
      [cartId]
    );

    await client.query('COMMIT');

    // Retornar pedido con detalles
    return await this.getOrderDetails(order.id_pedido);

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Obtener pedidos del usuario
exports.getUserOrders = async (userId, { estado_pedido = null, page = 1, limit = 20 } = {}) => {
  const offset = (page - 1) * limit;
  
  let query = `
    SELECT p.id_pedido, p.id_cliente, p.id_direccion, p.fecha_creacion,
           p.direccion_manual, p.total, p.estado_pedido, p.id_trabajador_asignado,
           u.usuario AS cliente_nombre
    FROM pedido p
    JOIN usuario u ON p.id_cliente = u.id
    WHERE p.id_cliente = $1
  `;

  const params = [userId];
  let paramCount = 2;

  if (estado_pedido) {
    query += ` AND p.estado_pedido = $${paramCount}`;
    params.push(estado_pedido);
    paramCount++;
  }

  query += ` ORDER BY p.fecha_creacion DESC
             LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);
  return result.rows;
};

// Obtener todos los pedidos (para empleado/admin)
exports.getAllOrders = async ({ estado_pedido = null, id_cliente = null, page = 1, limit = 20 } = {}) => {
  const offset = (page - 1) * limit;
  
  let query = `
    SELECT p.id_pedido, p.id_cliente, p.id_direccion, p.fecha_creacion,
           p.direccion_manual, p.total, p.estado_pedido, p.id_trabajador_asignado,
           u.usuario AS cliente_nombre, 
           t.usuario AS trabajador_nombre
    FROM pedido p
    JOIN usuario u ON p.id_cliente = u.id
    LEFT JOIN usuario t ON p.id_trabajador_asignado = t.id
    WHERE 1=1
  `;

  const params = [];
  let paramCount = 1;

  if (estado_pedido) {
    query += ` AND p.estado_pedido = $${paramCount}`;
    params.push(estado_pedido);
    paramCount++;
  }

  if (id_cliente) {
    query += ` AND p.id_cliente = $${paramCount}`;
    params.push(id_cliente);
    paramCount++;
  }

  query += ` ORDER BY p.fecha_creacion DESC
             LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);
  return result.rows;
};

// Obtener pedidos por rango de fechas
exports.getOrdersByDateRange = async (startDate, endDate, { estado_pedido = null } = {}) => {
  let query = `
    SELECT p.id_pedido, p.id_cliente, p.id_direccion, p.fecha_creacion,
           p.direccion_manual, p.total, p.estado_pedido, p.id_trabajador_asignado,
           u.usuario AS cliente_nombre,
           t.usuario AS trabajador_nombre
    FROM pedido p
    JOIN usuario u ON p.id_cliente = u.id
    LEFT JOIN usuario t ON p.id_trabajador_asignado = t.id
    WHERE DATE(p.fecha_creacion) >= $1 AND DATE(p.fecha_creacion) <= $2
  `;

  const params = [startDate, endDate];
  let paramCount = 3;

  if (estado_pedido) {
    query += ` AND p.estado_pedido = $${paramCount}`;
    params.push(estado_pedido);
  }

  query += ` ORDER BY p.fecha_creacion ASC`;

  const result = await pool.query(query, params);
  return result.rows;
};

// Buscar pedido por ID
exports.searchOrderById = async (orderId) => {
  const result = await pool.query(
    `SELECT p.id_pedido, p.id_cliente, p.id_direccion, p.fecha_creacion,
            p.direccion_manual, p.total, p.estado_pedido, p.id_trabajador_asignado,
            u.usuario AS cliente_nombre,
            t.usuario AS trabajador_nombre
     FROM pedido p
     JOIN usuario u ON p.id_cliente = u.id
     LEFT JOIN usuario t ON p.id_trabajador_asignado = t.id
     WHERE p.id_pedido = $1`,
    [orderId]
  );

  if (result.rows.length === 0) {
    throw new Error('Pedido no encontrado');
  }

  return result.rows[0];
};

// Obtener pedido con detalles completos
exports.getOrderDetails = async (orderId) => {
  // Obtener encabezado del pedido
  const orderResult = await pool.query(
    `SELECT p.id_pedido, p.id_cliente, p.id_direccion, p.fecha_creacion,
            p.direccion_manual, p.total, p.estado_pedido, p.id_trabajador_asignado,
            u.usuario AS cliente_nombre,
            t.usuario AS trabajador_nombre,
            d.id AS direccion_id, d.direccion, d.referencia, d.nombre_direccion
     FROM pedido p
     JOIN usuario u ON p.id_cliente = u.id
     LEFT JOIN usuario t ON p.id_trabajador_asignado = t.id
     LEFT JOIN direccion d ON p.id_direccion = d.id
     WHERE p.id_pedido = $1`,
    [orderId]
  );

  if (orderResult.rows.length === 0) {
    throw new Error('Pedido no encontrado');
  }

  const order = orderResult.rows[0];

  // Obtener detalles del pedido
  const detailsResult = await pool.query(
    `SELECT dp.id, dp.id_pedido, dp.id_producto, dp.cantidad, dp.subtotal, dp.observaciones,
            pr.nombre, pr.precio
     FROM detalle_pedido dp
     JOIN producto pr ON dp.id_producto = pr.id
     WHERE dp.id_pedido = $1
     ORDER BY dp.id ASC`,
    [orderId]
  );

  // Obtener opciones para cada detalle
  const details = [];
  for (const detail of detailsResult.rows) {
    const optionsResult = await pool.query(
      `SELECT dpo.id, dpo.id_opcion, op.nombre, op.precio_adicional
       FROM detalle_pedido_opcion dpo
       JOIN opcion_producto op ON dpo.id_opcion = op.id
       WHERE dpo.id_detalle = $1`,
      [detail.id]
    );

    details.push({
      ...detail,
      opciones: optionsResult.rows
    });
  }

  return {
    ...order,
    detalle_pedido: details
  };
};

// Actualizar estado del pedido
exports.updateOrderStatus = async (orderId, nuevoEstado) => {
  const result = await pool.query(
    `UPDATE pedido 
     SET estado_pedido = $1
     WHERE id_pedido = $2
     RETURNING id_pedido, estado_pedido`,
    [nuevoEstado, orderId]
  );

  if (result.rows.length === 0) {
    throw new Error('Pedido no encontrado');
  }

  return result.rows[0];
};

// Asignar trabajador a pedido
exports.assignWorkerToOrder = async (orderId, workerId) => {
  // Validar trabajador
  const workerCheck = await pool.query(
    'SELECT id_rol FROM usuario WHERE id = $1 AND (id_rol = 2 OR id_rol = 3)',
    [workerId]
  );

  if (workerCheck.rows.length === 0) {
    throw new Error('Trabajador no encontrado o rol inválido');
  }

  const result = await pool.query(
    `UPDATE pedido 
     SET id_trabajador_asignado = $1
     WHERE id_pedido = $2
     RETURNING id_pedido, id_trabajador_asignado`,
    [workerId, orderId]
  );

  if (result.rows.length === 0) {
    throw new Error('Pedido no encontrado');
  }

  return result.rows[0];
};

// Contar pedidos para paginación
exports.getOrdersCount = async ({ id_cliente = null, estado_pedido = null } = {}) => {
  let query = 'SELECT COUNT(*) as total FROM pedido WHERE 1=1';
  const params = [];
  let paramCount = 1;

  if (id_cliente) {
    query += ` AND id_cliente = $${paramCount}`;
    params.push(id_cliente);
    paramCount++;
  }

  if (estado_pedido) {
    query += ` AND estado_pedido = $${paramCount}`;
    params.push(estado_pedido);
  }

  const result = await pool.query(query, params);
  return Number(result.rows[0].total);
};
