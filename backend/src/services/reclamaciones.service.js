const pool = require('../config/db');

exports.createReclamacion = async ({ nombre, email, tipo_mensaje, calificacion, mensaje }) => {
  const result = await pool.query(
    `INSERT INTO libro_reclamaciones (nombre, email, tipo_mensaje, calificacion, mensaje)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, nombre, email, tipo_mensaje, calificacion, mensaje, fecha_creacion`,
    [nombre, email, tipo_mensaje, calificacion, mensaje]
  );

  return result.rows[0];
};

exports.getAllReclamaciones = async () => {
  const result = await pool.query(
    `SELECT id, nombre, email, tipo_mensaje, calificacion, mensaje, fecha_creacion
     FROM libro_reclamaciones
     ORDER BY fecha_creacion DESC`
  );

  return result.rows;
};
