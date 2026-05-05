const pool = require('../config/db');

const generateCartKey = (productoId, opciones = {}) => {
  const sorted = JSON.stringify(sortObject(opciones));
  return `${productoId}-${sorted}`;
};

const sortObject = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(sortObject);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortObject(obj[key]);
        return acc;
      }, {});
  }
  return obj;
};

const getCart = async (userId) => {
  const result = await pool.query(
    'SELECT id, usuario_id, creado_en, actualizado_en FROM carrito WHERE usuario_id=$1',
    [userId]
  );

  if (result.rows.length > 0) {
    return result.rows[0];
  }

  const created = await pool.query(
    `INSERT INTO carrito (usuario_id) VALUES ($1)
     RETURNING id, usuario_id, creado_en, actualizado_en`,
    [userId]
  );

  return created.rows[0];
};

const getCartItems = async (cartId) => {
  const result = await pool.query(
    `SELECT
       ci.id,
       ci.producto_id AS "productoId",
       p.nombre,
       ci.cantidad,
       ci.opciones,
       ci.precio_unitario AS "precioUnitario",
       (ci.cantidad * ci.precio_unitario) AS total
     FROM carrito_item ci
     JOIN producto p ON p.id = ci.producto_id
     WHERE ci.carrito_id=$1
     ORDER BY ci.id ASC`,
    [cartId]
  );

  return result.rows;
};

exports.getOrCreateCart = getCart;

exports.getCartByUser = async (userId) => {
  const cart = await getCart(userId);
  const items = await getCartItems(cart.id);

  return {
    cart,
    items,
    total: items.reduce((sum, item) => sum + Number(item.total), 0)
  };
};

exports.addItem = async ({ userId, productoId, cantidad, opciones }) => {
  const cart = await getCart(userId);

  const productResult = await pool.query(
    'SELECT id, precio, disponible FROM producto WHERE id=$1 AND disponible = true',
    [productoId]
  );

  if (productResult.rows.length === 0) {
    throw new Error('Producto no encontrado o no disponible');
  }

  const product = productResult.rows[0];

  const clave = generateCartKey(productoId, opciones);

  const existing = await pool.query(
    'SELECT id, cantidad FROM carrito_item WHERE carrito_id=$1 AND clave_personalizacion=$2',
    [cart.id, clave]
  );

  if (existing.rows.length > 0) {
    const updated = await pool.query(
      `UPDATE carrito_item
       SET cantidad = $1,
           actualizado_en = NOW()
       WHERE id = $2
       RETURNING *`,
      [existing.rows[0].cantidad + cantidad, existing.rows[0].id]
    );

    return updated.rows[0];
  }

  const inserted = await pool.query(
    `INSERT INTO carrito_item 
     (carrito_id, producto_id, cantidad, opciones, precio_unitario, clave_personalizacion)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [cart.id, productoId, cantidad, opciones || null, product.precio, clave]
  );

  return inserted.rows[0];
};

exports.updateItem = async ({ userId, itemId, cantidad, opciones }) => {
  const cart = await getCart(userId);

  const existing = await pool.query(
    'SELECT id, producto_id FROM carrito_item WHERE id=$1 AND carrito_id=$2',
    [itemId, cart.id]
  );

  if (existing.rows.length === 0) {
    throw new Error('Item de carrito no pertenece al usuario');
  }

  const fields = [];
  const values = [];
  let idx = 1;

  if (cantidad !== undefined) {
    fields.push(`cantidad = $${idx++}`);
    values.push(cantidad);
  }

  let updatedItem = null;
  let newClave = null;
  let newCantidad = undefined;

  if (cantidad !== undefined) {
    fields.push(`cantidad = $${idx++}`);
    values.push(cantidad);
    newCantidad = cantidad;
  }

  if (opciones !== undefined) {
    newClave = generateCartKey(existing.rows[0].producto_id, opciones);
    fields.push(`opciones = $${idx++}`);
    values.push(opciones);

    fields.push(`clave_personalizacion = $${idx++}`);
    values.push(newClave);
  }

  if (fields.length === 0) {
    throw new Error('No se proporcionaron campos para actualizar');
  }

  const currentCantidad = existing.rows[0].cantidad;
  newCantidad = newCantidad !== undefined ? newCantidad : currentCantidad;

  if (newClave) {
    const duplicate = await pool.query(
      'SELECT id, cantidad FROM carrito_item WHERE carrito_id=$1 AND clave_personalizacion=$2 AND id<>$3',
      [cart.id, newClave, itemId]
    );

    if (duplicate.rows.length > 0) {
      const mergedQuantity = duplicate.rows[0].cantidad + newCantidad;

      const updatedDuplicate = await pool.query(
        `UPDATE carrito_item
         SET cantidad = $1,
             actualizado_en = NOW()
         WHERE id = $2
         RETURNING *`,
        [mergedQuantity, duplicate.rows[0].id]
      );

      await pool.query('DELETE FROM carrito_item WHERE id=$1', [itemId]);
      return updatedDuplicate.rows[0];
    }
  }

  values.push(itemId);

  const query = `
    UPDATE carrito_item 
    SET ${fields.join(', ')}, actualizado_en = NOW() 
    WHERE id = $${idx} 
    RETURNING *`;

  const result = await pool.query(query, values);

  return result.rows[0];
};

exports.removeItem = async ({ userId, itemId }) => {
  const cart = await getCart(userId);

  const deleted = await pool.query(
    'DELETE FROM carrito_item WHERE id=$1 AND carrito_id=$2 RETURNING *',
    [itemId, cart.id]
  );

  if (deleted.rows.length === 0) {
    throw new Error('Item no encontrado en el carrito');
  }

  return deleted.rows[0];
};

exports.syncCart = async ({ userId, items }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const cart = await getCart(userId);

    for (const item of items) {
      const productResult = await client.query(
        'SELECT id, precio FROM producto WHERE id=$1 AND disponible=true',
        [item.productoId]
      );

      if (productResult.rows.length === 0) continue;

      const product = productResult.rows[0];
      const clave = generateCartKey(item.productoId, item.opciones);

      await client.query(
        `INSERT INTO carrito_item 
         (carrito_id, producto_id, cantidad, opciones, precio_unitario, clave_personalizacion)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (carrito_id, clave_personalizacion)
         DO UPDATE SET 
           cantidad = carrito_item.cantidad + EXCLUDED.cantidad,
           actualizado_en = NOW()`,
        [cart.id, item.productoId, item.cantidad, item.opciones || null, product.precio, clave]
      );
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }

  return exports.getCartByUser(userId);
};