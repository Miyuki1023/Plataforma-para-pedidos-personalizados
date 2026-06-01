const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { addToBlacklist } = require('../middlewares/auth');
const emailService = require('./email.service');

exports.register = async ({
  usuario,
  email,
  password,
  rol = 1,
  fecha_nacimiento,
  sexo,
  telefono
}) => {

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

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const verificationExpires = new Date(
    Date.now() + 10 * 60 * 1000
  );

  try {

    await emailService.sendVerificationEmail(
      email,
      verificationCode
    );

    const result = await pool.query(
      `INSERT INTO usuario (
        usuario,
        email,
        password,
        id_rol,
        fecha_nacimiento,
        sexo,
        telefono,
        verification_code,
        verified,
        verification_expires
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
      )
      RETURNING
        id,
        usuario,
        email,
        id_rol,
        verified`,
      [
        usuario,
        email,
        hashed,
        rol,
        fecha_nacimiento,
        sexo,
        telefono,
        verificationCode,
        false,
        verificationExpires
      ]
    );

    return result.rows[0];

  } catch (error) {

    console.error(error);

    throw new Error(
      'No se pudo enviar el correo de verificación'
    );

  }

};

//CONFIRMA SI LA CUENTA YA ESTA VERIFICADA
exports.verifyAccount = async (email, code) => {

  if (!email || !code) {
    throw new Error('Email y código requeridos');
  }

  const result = await pool.query(
    `SELECT id, verification_code, verification_expires, verified
     FROM usuario
     WHERE email = $1`,
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error('Usuario no encontrado');
  }

  const user = result.rows[0];

  if (user.verified) {
    throw new Error('La cuenta ya está verificada');
  }

  if (user.verification_code !== code) {
    throw new Error('Código incorrecto');
  }

  if (new Date() > user.verification_expires) {
    throw new Error('Código expirado');
  }

  await pool.query(
    `UPDATE usuario
     SET verified = true,
         verification_code = NULL,
         verification_expires = NULL
     WHERE email = $1`,
    [email]
  );

  return {
    message: 'Cuenta verificada correctamente'
  };
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

  // VALIDAR SI LA CUENTA ESTÁ VERIFICADA
  if (!user.verified) {
    throw new Error('Cuenta no verificada');
  }

  const valid = await bcrypt.compare(
    password,
    user.password
  );

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
  const validRoles = [2, 3];
  if (!validRoles.includes(rol)) {
    throw new Error('Rol inválido. Solo se puede crear usuarios con rol 2 (trabajador) o 3 (admin)');
  }

  // Check if the requester is an admin
  const adminCheck = await pool.query(
    'SELECT id_rol FROM usuario WHERE id = $1 AND activo = true',
    [adminId]
  );

  if (adminCheck.rows.length === 0 || adminCheck.rows[0].id_rol !== 3) {
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


//recuperar contraseña
exports.forgotPassword = async (email) => {

  const result = await pool.query(
    'SELECT id, email FROM usuario WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error('Usuario no encontrado');
  }

  const resetCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const resetExpires = new Date(
    Date.now() + 10 * 60 * 1000
  );

  await pool.query(
    `UPDATE usuario
     SET reset_code = $1,
         reset_expires = $2
     WHERE email = $3`,
    [resetCode, resetExpires, email]
  );

  await emailService.sendResetPasswordEmail(
    email,
    resetCode
  );

  return {
    message: 'Código enviado al correo'
  };
};

exports.changePassword = async (
  email,
  code,
  newPassword
) => {

  const result = await pool.query(
    `SELECT
        reset_code,
        reset_expires
     FROM usuario
     WHERE email = $1`,
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error('Usuario no encontrado');
  }

  const user = result.rows[0];

  if (user.reset_code !== code) {
    throw new Error('Código incorrecto');
  }

  if (new Date() > user.reset_expires) {
    throw new Error('Código expirado');
  }

  const hashedPassword =
    await bcrypt.hash(newPassword, 10);

  await pool.query(
    `UPDATE usuario
     SET password = $1,
         reset_code = NULL,
         reset_expires = NULL
     WHERE email = $2`,
    [hashedPassword, email]
  );

  return {
    message: 'Contraseña actualizada correctamente'
  };
};