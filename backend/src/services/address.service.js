const pool = require('../config/db');

exports.getUserAddresses = async (userId) => {
  // Obtener todas las direcciones del usuario con información del distrito
  const result = await pool.query(
    `SELECT d.id, d.id_usuario, d.calle AS direccion, d.referencia, d.id_distrito,
            d.ciudad AS nombre_direccion, d.is_default, dist.nombre AS distrito_nombre
     FROM direccion d
     INNER JOIN distrito dist ON d.id_distrito = dist.id
     WHERE d.id_usuario = $1
     ORDER BY d.fecha_creacion DESC`,
    [userId]
  );

  return result.rows;
};

exports.getAddressById = async (userId, addressId) => {
  // Obtener dirección específica del usuario
  const result = await pool.query(
    `SELECT d.id, d.id_usuario, d.calle AS direccion, d.referencia, d.id_distrito,
            d.ciudad AS nombre_direccion, d.is_default, dist.nombre AS distrito_nombre
     FROM direccion d
     INNER JOIN distrito dist ON d.id_distrito = dist.id
     WHERE d.id = $1 AND d.id_usuario = $2`,
    [addressId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('Dirección no encontrada');
  }

  return result.rows[0];
};

exports.createAddress = async (userId, addressData) => {
  const { direccion, referencia, id_distrito, nombre_direccion, is_default } = addressData;

  // Verificar que el distrito existe
  const districtCheck = await pool.query(
    'SELECT id FROM distrito WHERE id = $1',
    [id_distrito || 1] // Usamos 1 como default si no viene
  );

  if (districtCheck.rows.length === 0) {
    throw new Error('Distrito no válido');
  }

  const result = await pool.query(
    `INSERT INTO direccion (id_usuario, calle, referencia, id_distrito, ciudad, is_default)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, id_usuario, calle AS direccion, referencia, id_distrito, ciudad AS nombre_direccion, fecha_creacion, is_default`,
    [userId, direccion, referencia, id_distrito || 1, nombre_direccion, is_default || false]
  );

  // Si esta será la dirección principal, desmarcar las otras del usuario
  if (is_default) {
    await pool.query(
      'UPDATE direccion SET is_default = false WHERE id_usuario = $1 AND id != $2',
      [userId, result.rows[0].id]
    );
  }

  // Obtener la dirección creada con el nombre del distrito
  return await exports.getAddressById(userId, result.rows[0].id);
};

exports.updateAddress = async (userId, addressId, addressData) => {
  const { direccion, referencia, id_distrito, nombre_direccion } = addressData;

  // Verificar que la dirección existe y pertenece al usuario
  const addressCheck = await pool.query(
    'SELECT id FROM direccion WHERE id = $1 AND id_usuario = $2',
    [addressId, userId]
  );

  if (addressCheck.rows.length === 0) {
    throw new Error('Dirección no encontrada o no pertenece al usuario');
  }

  // Verificar que el distrito existe si se proporciona
  if (id_distrito) {
    const districtCheck = await pool.query(
      'SELECT id FROM distrito WHERE id = $1',
      [id_distrito]
    );

    if (districtCheck.rows.length === 0) {
      throw new Error('Distrito no válido');
    }
  }

  // Construir consulta de actualización dinámica
  const updates = [];
  const values = [];
  let paramCount = 1;

  if (direccion !== undefined) {
    updates.push(`calle = $${paramCount}`);
    values.push(direccion);
    paramCount++;
  }

  if (referencia !== undefined) {
    updates.push(`referencia = $${paramCount}`);
    values.push(referencia);
    paramCount++;
  }

  if (id_distrito !== undefined) {
    updates.push(`id_distrito = $${paramCount}`);
    values.push(id_distrito);
    paramCount++;
  }

  if (nombre_direccion !== undefined) {
    updates.push(`ciudad = $${paramCount}`);
    values.push(nombre_direccion);
    paramCount++;
  }

  if (updates.length === 0) {
    throw new Error('No se proporcionaron campos para actualizar');
  }

  // Agregar addressId y userId como los últimos parámetros
  values.push(addressId, userId);

  const query = `
    UPDATE direccion
    SET ${updates.join(', ')}
    WHERE id = $${paramCount} AND id_usuario = $${paramCount + 1}
    RETURNING id
  `;

  await pool.query(query, values);

  // Retornar dirección actualizada
  return await exports.getAddressById(userId, addressId);
};
exports.deleteAddress = async (userId, addressId) => {
  const result = await pool.query(
    // ✅ "ciudad" es el nombre real de la columna
    'DELETE FROM direccion WHERE id = $1 AND id_usuario = $2 RETURNING id, ciudad',
    [addressId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('Dirección no encontrada o no pertenece al usuario');
  }

  return {
    id: result.rows[0].id,
    nombre_direccion: result.rows[0].ciudad,  // ✅ mapeamos al nombre del frontend
    message: `Dirección eliminada exitosamente`
  };
};

exports.getDistricts = async () => {
  const result = await pool.query(
    'SELECT id, nombre AS distrito FROM distrito ORDER BY nombre ASC'
  );

  return result.rows;
};