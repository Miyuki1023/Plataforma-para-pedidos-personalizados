const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async ({ usuario, email, password }) => {

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
    `INSERT INTO usuario (usuario, email, password)
     VALUES ($1,$2,$3)
     RETURNING id, usuario, email`,
    [usuario, email, hashed]
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
      email: user.email
    }
  };
};