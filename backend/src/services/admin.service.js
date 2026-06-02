const pool = require('../config/db');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (adminId) => {
  // Verificar permisos de admin
  const adminCheck = await pool.query(
    'SELECT id_rol FROM usuario WHERE id = $1 AND activo = true',
    [adminId]
  );

  if (adminCheck.rows.length === 0 || adminCheck.rows[0].id_rol !== 3) {
    throw new Error('Acceso denegado: se requieren permisos de administrador');
  }

  const result = await pool.query(
    `SELECT id, usuario, apellido, foto_perfil, email, fecha_nacimiento, sexo, telefono, id_rol, activo, fecha_registro
     FROM usuario
     ORDER BY fecha_registro DESC`
  );

  return result.rows;
};

exports.updateUserRole = async (adminId, targetUserId, newRole) => {
  // Verificar permisos de admin
  const adminCheck = await pool.query(
    'SELECT id_rol FROM usuario WHERE id = $1 AND activo = true',
    [adminId]
  );

  if (adminCheck.rows.length === 0 || adminCheck.rows[0].id_rol !== 3) {
    throw new Error('Acceso denegado: se requieren permisos de administrador');
  }

  // Validar rol
  const validRoles = [1, 2, 3];
  if (!validRoles.includes(newRole)) {
    throw new Error('Rol inválido. Los roles válidos son: 1 (usuario), 2 (trabajador), 3 (admin)');
  }

  // Check if target user exists
  const userCheck = await pool.query(
    'SELECT id, usuario, id_rol FROM usuario WHERE id = $1',
    [targetUserId]
  );

  if (userCheck.rows.length === 0) {
    throw new Error('Usuario no encontrado');
  }

  const currentUser = userCheck.rows[0];

  // Evitar que el admin se demote a sí mismo
  if (targetUserId === adminId && newRole !== 3) {
    throw new Error('No puedes cambiar tu propio rol de administrador');
  }

  // Actualizar el rol
  const result = await pool.query(
    `UPDATE usuario
     SET id_rol = $1
     WHERE id = $2
     RETURNING id, usuario, email, id_rol`,
    [newRole, targetUserId]
  );

  return {
    user: result.rows[0],
    previousRole: currentUser.id_rol,
    newRole: newRole,
    message: `Rol de usuario ${currentUser.usuario} cambiado de ${currentUser.id_rol} a ${newRole}`
  };
};

exports.toggleUserStatus = async (adminId, targetUserId, activate) => {
  // Verificar permisos de admin
  const adminCheck = await pool.query(
    'SELECT id_rol FROM usuario WHERE id = $1 AND activo = true',
    [adminId]
  );

  if (adminCheck.rows.length === 0 || adminCheck.rows[0].id_rol !== 3) {
    throw new Error('Acceso denegado: se requieren permisos de administrador');
  }

  // Check if target user exists
  const userCheck = await pool.query(
    'SELECT id, usuario, activo FROM usuario WHERE id = $1',
    [targetUserId]
  );

  if (userCheck.rows.length === 0) {
    throw new Error('Usuario no encontrado');
  }

  const currentUser = userCheck.rows[0];

  // Evitar que el admin se desactive a sí mismo
  if (targetUserId === adminId && !activate) {
    throw new Error('No puedes desactivar tu propia cuenta');
  }

  // Actualizar el estado
  const result = await pool.query(
    `UPDATE usuario
     SET activo = $1
     WHERE id = $2
     RETURNING id, usuario, email, activo`,
    [activate, targetUserId]
  );

  const action = activate ? 'activado' : 'desactivado';

  return {
    user: result.rows[0],
    previousStatus: currentUser.activo,
    newStatus: activate,
    message: `Usuario ${currentUser.usuario} ha sido ${action}`
  };
};

exports.getUserById = async (adminId, targetUserId) => {
  // Verificar permisos de admin
  const adminCheck = await pool.query(
    'SELECT id_rol FROM usuario WHERE id = $1 AND activo = true',
    [adminId]
  );

  if (adminCheck.rows.length === 0 || adminCheck.rows[0].id_rol !== 3) {
    throw new Error('Acceso denegado: se requieren permisos de administrador');
  }

  const result = await pool.query(
    `SELECT id, usuario, apellido, foto_perfil, email, fecha_nacimiento, sexo, telefono, id_rol, activo, fecha_registro
     FROM usuario
     WHERE id = $1`,
    [targetUserId]
  );

  if (result.rows.length === 0) {
    throw new Error('Usuario no encontrado');
  }

  return result.rows[0];
};

exports.createGoal = async (
  fecha,
  meta
) => {

  const existingGoal = await pool.query(
    `
    SELECT id
    FROM meta_diaria
    WHERE fecha = $1
    `,
    [fecha]
  );

  if (existingGoal.rows.length > 0) {
    throw new Error(
      'Ya existe una meta para esa fecha'
    );
  }

  const result = await pool.query(
    `
    INSERT INTO meta_diaria
    (
      fecha,
      meta
    )
    VALUES
    (
      $1,
      $2
    )
    RETURNING *
    `,
    [fecha, meta]
  );

  return result.rows[0];

};

//obtener canitdad de pedidos x dia
exports.getGoalByDate = async (fecha) => {

  const goalResult = await pool.query(
    `
    SELECT *
    FROM meta_diaria
    WHERE fecha = $1
    `,
    [fecha]
  );

  if (goalResult.rows.length === 0) {
    throw new Error('No existe meta para esa fecha');
  }

  const goal = goalResult.rows[0];

  const ordersResult = await pool.query(
    `
    SELECT COUNT(*) AS total
    FROM pedido
    WHERE DATE(fecha_creacion) = $1
    `,
    [fecha]
  );

  const pedidosActuales =
    parseInt(ordersResult.rows[0].total);

  const cumplimiento =
    goal.meta > 0
      ? Math.round(
          (pedidosActuales / goal.meta) * 100
        )
      : 0;

  return {
    fecha,
    meta: goal.meta,
    pedidos_actuales: pedidosActuales,
    cumplimiento
  };

};

//actualizar meta diaria
exports.updateGoal = async (
  fecha,
  meta
) => {

  const result = await pool.query(
    `
    UPDATE meta_diaria
    SET meta = $1
    WHERE fecha = $2
    RETURNING *
    `,
    [meta, fecha]
  );

  if (result.rows.length === 0) {
    throw new Error(
      'No existe meta para esa fecha'
    );
  }

  return result.rows[0];

};