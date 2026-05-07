const pool = require('../config/db');

exports.getUserAddresses = async (userId) => {
  // Obtener todas las direcciones del usuario con información del distrito
  const result = await pool.query(
    `SELECT d.id, d.id_usuario, d.direccion, d.referencia, d.id_distrito,
            d.nombre_direccion, d.fecha_creacion, dist.distrito
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
    `SELECT d.id, d.id_usuario, d.direccion, d.referencia, d.id_distrito,
            d.nombre_direccion, d.fecha_creacion, dist.distrito
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
  const { direccion, referencia, id_distrito, nombre_direccion } = addressData;

  // Verificar que el distrito existe
  const districtCheck = await pool.query(
    'SELECT id FROM distrito WHERE id = $1',
    [id_distrito]
  );

  if (districtCheck.rows.length === 0) {
    throw new Error('Distrito no válido');
  }

  const result = await pool.query(
    `INSERT INTO direccion (id_usuario, direccion, referencia, id_distrito, nombre_direccion)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, id_usuario, direccion, referencia, id_distrito, nombre_direccion, fecha_creacion`,
    [userId, direccion, referencia, id_distrito, nombre_direccion]
  );

  // Obtener la dirección creada con el nombre del distrito
  return await this.getAddressById(userId, result.rows[0].id);
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
    updates.push(`direccion = $${paramCount}`);
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
    updates.push(`nombre_direccion = $${paramCount}`);
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
  return await this.getAddressById(userId, addressId);
};

exports.deleteAddress = async (userId, addressId) => {
  const result = await pool.query(
    'DELETE FROM direccion WHERE id = $1 AND id_usuario = $2 RETURNING id, nombre_direccion',
    [addressId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('Dirección no encontrada o no pertenece al usuario');
  }

  return {
    id: result.rows[0].id,
    nombre_direccion: result.rows[0].nombre_direccion,
    message: `Dirección "${result.rows[0].nombre_direccion}" eliminada exitosamente`
  };
};

exports.getDistricts = async () => {
  const result = await pool.query(
    'SELECT id, distrito FROM distrito ORDER BY distrito ASC'
  );

  return result.rows;
};