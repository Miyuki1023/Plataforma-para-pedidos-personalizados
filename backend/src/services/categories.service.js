const pool = require('../config/db');

exports.getAllCategories = async () => {
  // Consultamos la tabla 'categories' y la columna 'nombre' según tu SQL
  const result = await pool.query(
    'SELECT nombre FROM categories ORDER BY nombre ASC'
  );
  
  // Retornamos un array simple de strings para facilitar el consumo en el frontend
  return result.rows.map(row => row.nombre);
};
