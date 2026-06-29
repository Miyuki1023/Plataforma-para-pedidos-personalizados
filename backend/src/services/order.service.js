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

const buildCreateOrderPayload = (data = {}) => ({
  id_cliente: data.userId,
  id_direccion: data.id_direccion ?? null,
  total: Number(data.total ?? 0),
  estado_pedido: data.estado_pedido || 'pendiente',
  metodo_pago: data.metodo_pago || null,
  codigo_pago: data.codigo_pago || null,
  fecha_entrega: data.fecha_entrega || null,
  horario_entrega: data.horario_entrega || null,
  costo_envio: Number(data.costo_envio ?? 0),
});

const normalizeOrderItems = (items = []) => {
  if (!Array.isArray(items)) return [];

  return items
    .filter(Boolean)
    .map((item) => ({
      producto_id: Number(item.producto_id ?? item.productoId ?? item.id ?? 0),
      cantidad: Number(item.cantidad ?? item.quantity ?? 1),
      precio_unitario: Number(item.precio_unitario ?? item.price ?? item.precio ?? 0),
      opciones: item.opciones ?? item.options ?? null,
    }))
    .filter((item) => item.producto_id > 0);
};

exports.buildCreateOrderPayload = buildCreateOrderPayload;
exports.normalizeOrderItems = normalizeOrderItems;

// Crear pedido desde carrito
exports.createOrderFromCart = async (userId, payload = {}) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const {
      id_direccion,
      observaciones,
      id_trabajador_asignado,
      metodo_pago,
      codigo_pago,
      fecha_entrega,
      horario_entrega,
      costo_envio,
    } = payload;

    const requestItems = normalizeOrderItems(payload.items || payload.cartItems);

    let cartId = null;
    const cartResult = await client.query(
      'SELECT id FROM carrito WHERE usuario_id = $1',
      [userId]
    );

    if (cartResult.rows.length > 0) {
      cartId = cartResult.rows[0].id;
    } else {
      const createdCart = await client.query(
        'INSERT INTO carrito (usuario_id) VALUES ($1) RETURNING id',
        [userId]
      );
      cartId = createdCart.rows[0].id;
    }

    let items = [];
    if (requestItems.length > 0) {
      items = requestItems;
    } else {
      const itemsResult = await client.query(
        `SELECT id, producto_id, cantidad, opciones, precio_unitario
         FROM carrito_item WHERE carrito_id = $1`,
        [cartId]
      );

      items = itemsResult.rows.map((item) => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        opciones: item.opciones,
        precio_unitario: item.precio_unitario,
      }));
    }

    if (items.length === 0) {
      throw new Error('El carrito está vacío');
    }

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
      const subtotal = Number(item.precio_unitario || 0) * Number(item.cantidad || 1);
      total += subtotal;
    }

    const orderPayload = buildCreateOrderPayload({
      userId,
      id_direccion,
      total,
      estado_pedido: 'pendiente',
      metodo_pago,
      codigo_pago,
      fecha_entrega,
      horario_entrega,
      costo_envio,
    });

    const orderResult = await client.query(
      `INSERT INTO pedido (
        id_cliente, id_direccion, total, estado_pedido, metodo_pago, codigo_pago, fecha_entrega, horario_entrega, costo_envio
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id_pedido, id_cliente, id_direccion, total, estado_pedido, metodo_pago, codigo_pago, fecha_entrega, horario_entrega, costo_envio, fecha_creacion`,
      [
        orderPayload.id_cliente,
        orderPayload.id_direccion,
        orderPayload.total,
        orderPayload.estado_pedido,
        orderPayload.metodo_pago,
        orderPayload.codigo_pago,
        orderPayload.fecha_entrega,
        orderPayload.horario_entrega,
        orderPayload.costo_envio,
      ]
    );

    const order = orderResult.rows[0];

    // Insertar detalles del pedido
    for (const item of items) {
      const subtotal = Number(item.precio_unitario || 0) * Number(item.cantidad || 1);

      await client.query(
        `INSERT INTO detalle_pedido (
          id_pedido, id_producto, cantidad, subtotal, observaciones, precio_unitario
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id_pedido, item.producto_id, item.cantidad, subtotal, observaciones || null, Number(item.precio_unitario || 0)]
      );
    }

    // Limpiar carrito
    await client.query(
      'DELETE FROM carrito_item WHERE carrito_id = $1',
      [cartId]
    );

    await client.query('COMMIT');

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
           p.total, p.estado_pedido, p.metodo_pago, p.codigo_pago,
           p.fecha_entrega, p.horario_entrega, p.costo_envio,
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
           p.total, p.estado_pedido, p.metodo_pago, p.codigo_pago,
           p.fecha_entrega, p.horario_entrega, p.costo_envio,
           u.usuario AS cliente_nombre
    FROM pedido p
    JOIN usuario u ON p.id_cliente = u.id
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
           p.total, p.estado_pedido, p.metodo_pago, p.codigo_pago,
           p.fecha_entrega, p.horario_entrega, p.costo_envio,
           u.usuario AS cliente_nombre
    FROM pedido p
    JOIN usuario u ON p.id_cliente = u.id
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
            p.total, p.estado_pedido, p.metodo_pago, p.codigo_pago,
            p.fecha_entrega, p.horario_entrega, p.costo_envio,
            u.usuario AS cliente_nombre
     FROM pedido p
     JOIN usuario u ON p.id_cliente = u.id
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
            p.total, p.estado_pedido, p.metodo_pago, p.codigo_pago,
            p.fecha_entrega, p.horario_entrega, p.costo_envio,
            u.usuario AS cliente_nombre,
            d.id AS direccion_id, d.calle AS direccion, d.referencia, d.ciudad AS nombre_direccion
     FROM pedido p
     JOIN usuario u ON p.id_cliente = u.id
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

  const details = detailsResult.rows.map((detail) => ({
    ...detail,
    opciones: []
  }));

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
  const orderCheck = await pool.query(
    'SELECT id_pedido FROM pedido WHERE id_pedido = $1',
    [orderId]
  );

  if (orderCheck.rows.length === 0) {
    throw new Error('Pedido no encontrado');
  }

  return {
    id_pedido: orderId,
    id_trabajador_asignado: null
  };
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