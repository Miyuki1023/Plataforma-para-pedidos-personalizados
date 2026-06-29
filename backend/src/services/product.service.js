const pool = require('../config/db');

exports.getProducts = async () => {
  // Eliminamos el WHERE disponible = true para que el editor de productos 
  // pueda listar y re-activar los productos apagados.
  const result = await pool.query(`
    SELECT 
      id,
      nombre,
      descripcion,
      precio,
      categoria,
      disponible,
      imagen_url,
      badge,
      subtitulo,
      stock
    FROM producto
    ORDER BY id ASC
  `);

  return result.rows;
};

exports.getProductById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM producto WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

exports.createProduct = async (data) => {
  const { nombre, descripcion, precio, categoria, stock, imagenUrls, disponible } = data;
  const result = await pool.query(
    `INSERT INTO producto (nombre, descripcion, precio, categoria, stock, imagen_url, disponible)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [nombre, descripcion, precio, categoria, stock, imagenUrls, disponible]
  );
  return result.rows[0];
};

exports.updateProduct = async (id, data) => {
  const { nombre, descripcion, precio, categoria, stock, imagenUrls, disponible } = data;
  const result = await pool.query(
    `UPDATE producto 
     SET nombre = $1, descripcion = $2, precio = $3, categoria = $4, stock = $5, imagen_url = $6, disponible = $7
     WHERE id = $8
     RETURNING *`,
    [nombre, descripcion, precio, categoria, stock, imagenUrls, disponible, id]
  );
  return result.rows[0];
};

exports.createOption = async (productId, optionData) => ({
  id: null,
  id_producto: productId,
  ...optionData,
});

exports.getProductOptions = async () => [];

exports.deleteProduct = async (id) => {
  const result = await pool.query(
    `UPDATE producto SET disponible = false WHERE id = $1`,
    [id]
  );
  return result.rowCount > 0;
};