const pool = require('../config/db');
const bcrypt = require('bcrypt');

exports.getUserProfile = async (userId) => {
  // Obtener perfil completo del usuario
  const result = await pool.query(
    `SELECT id, usuario, email, fecha_nacimiento, sexo, telefono, id_rol, activo, fecha_registro
     FROM usuario
     WHERE id = $1 AND activo = true`,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error('Usuario no encontrado');
  }

  return result.rows[0];
};

exports.updateUserProfile = async (userId, updateData) => {
  const { usuario, email, password, fecha_nacimiento, sexo, telefono } = updateData;

  // Construir consulta de actualización dinámica basada en campos proporcionados
  const updates = [];
  const values = [];
  let paramCount = 1;

  // Verificar restricciones únicas si se actualizan usuario o email
  if (usuario) {
    const existingUser = await pool.query(
      'SELECT id FROM usuario WHERE usuario = $1 AND id != $2',
      [usuario, userId]
    );
    if (existingUser.rows.length > 0) {
      throw new Error('El nombre de usuario ya está en uso');
    }
    updates.push(`usuario = $${paramCount}`);
    values.push(usuario);
    paramCount++;
  }

  if (email) {
    const existingEmail = await pool.query(
      'SELECT id FROM usuario WHERE email = $1 AND id != $2',
      [email, userId]
    );
    if (existingEmail.rows.length > 0) {
      throw new Error('El email ya está en uso');
    }
    updates.push(`email = $${paramCount}`);
    values.push(email);
    paramCount++;
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updates.push(`password = $${paramCount}`);
    values.push(hashedPassword);
    paramCount++;
  }

  if (fecha_nacimiento !== undefined) {
    updates.push(`fecha_nacimiento = $${paramCount}`);
    values.push(fecha_nacimiento);
    paramCount++;
  }

  if (sexo !== undefined) {
    updates.push(`sexo = $${paramCount}`);
    values.push(sexo);
    paramCount++;
  }

  if (telefono !== undefined) {
    updates.push(`telefono = $${paramCount}`);
    values.push(telefono);
    paramCount++;
  }

  if (updates.length === 0) {
    throw new Error('No se proporcionaron campos para actualizar');
  }

  // Agregar userId como último parámetro
  values.push(userId);

  const query = `
    UPDATE usuario
    SET ${updates.join(', ')}
    WHERE id = $${paramCount}
    RETURNING id, usuario, email, fecha_nacimiento, sexo, telefono, id_rol
  `;

  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    throw new Error('Usuario no encontrado');
  }

  return result.rows[0];
};