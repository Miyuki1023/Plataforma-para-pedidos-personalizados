const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { addToBlacklist } = require('../middlewares/auth');

exports.register = async ({ usuario, email, password, rol = 'usuario', fecha_nacimiento, sexo, telefono }) => {

  if (!usuario || !email || !password) {
    throw new Error('Faltan campos');
  }

  const exists = await pool.query(
    'SELECT 1 FROM usuario WHERE email=$1 OR usuario=$2',
    [email, usuario]
  );

  if (exists.rows.length > 0) {
    throw new Error('Usuario o email ya existe');
  }

  const hashed = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO usuario (usuario, email, password, id_rol, fecha_nacimiento, sexo, telefono)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, usuario, email, id_rol, fecha_nacimiento, sexo, telefono`,
    [usuario, email, hashed, rol, fecha_nacimiento, sexo, telefono]
  );

  return result.rows[0];
};

exports.login = async ({ email, password }) => {

  if (!email || !password) {
    throw new Error('Faltan campos');
  }

  const result = await pool.query(
    'SELECT * FROM usuario WHERE email=$1 AND activo=true',
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error('Credenciales inválidas');
  }

  const user = result.rows[0];

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new Error('Credenciales inválidas');
  }

  const token = jwt.sign(
    { id: user.id, rol: user.id_rol },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return {
    token,
    user: {
      id: user.id,
      usuario: user.usuario,
      email: user.email,
      rol: user.id_rol
    }
  };
};

exports.adminRegister = async ({ usuario, email, password, rol, fecha_nacimiento, sexo, telefono }, adminId) => {
  // Validate that the admin is creating the user
  if (!adminId) {
    throw new Error('Solo administradores pueden crear usuarios');
  }

  // Validate role
  const validRoles = ['trabajador', 'admin'];
  if (!validRoles.includes(rol)) {
    throw new Error('Rol inválido. Solo se puede crear usuarios con rol "trabajador" o "admin"');
  }

  // Check if the requester is an admin
  const adminCheck = await pool.query(
    'SELECT id_rol FROM usuario WHERE id = $1 AND activo = true',
    [adminId]
  );

  if (adminCheck.rows.length === 0 || adminCheck.rows[0].id_rol !== 'admin') {
    throw new Error('Solo administradores pueden crear usuarios con roles especiales');
  }

  // Register the user with the specified role and optional fields
  return await this.register({ usuario, email, password, rol, fecha_nacimiento, sexo, telefono });
};

exports.logout = async (token) => {
  if (!token) {
    throw new Error('Token no proporcionado');
  }

  addToBlacklist(token);

  return { message: 'Sesión cerrada exitosamente' };
};