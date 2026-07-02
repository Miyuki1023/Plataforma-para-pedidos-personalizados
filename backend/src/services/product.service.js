const pool = require('../config/db');

exports.getProducts = async (query = {}) => {
  const { limit, offset, fields, search, categoria } = query;

  let sql = `
    SELECT 
      id,
      nombre,
      precio,
      categoria,
      disponible,
      imagen_url,
      stock
  `;

  // Only include description and subtitle when explicitly requested (not for home page)
  if (fields && fields.includes('descripcion')) {
    sql = sql.replace('stock', 'stock, descripcion');
  }
  if (fields && fields.includes('subtitulo')) {
    sql = sql.replace('stock', 'stock, subtitulo');
  }
  if (fields && fields.includes('badge')) {
    sql = sql.replace('stock', 'stock, badge');
  }
  if (fields && fields.includes('fecha_creacion')) {
    sql = sql.replace('stock', 'stock, fecha_creacion');
  }

  sql += `\n    FROM producto\n    WHERE disponible = true`;

  const params = [];
  let paramIndex = 1;

  if (categoria) {
    sql += ` AND UPPER(categoria) = UPPER($${paramIndex})`;
    params.push(categoria);
    paramIndex++;
  }

  if (search) {
    sql += ` AND (LOWER(nombre) LIKE LOWER($${paramIndex}) OR LOWER(descripcion) LIKE LOWER($${paramIndex}))`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  sql += `\n    ORDER BY id ASC`;

  if (limit) {
    sql += ` LIMIT $${paramIndex}`;
    params.push(parseInt(limit, 10));
    paramIndex++;
  }

  if (offset) {
    sql += ` OFFSET $${paramIndex}`;
    params.push(parseInt(offset, 10));
    paramIndex++;
  }

  const result = await pool.query(sql, params);
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