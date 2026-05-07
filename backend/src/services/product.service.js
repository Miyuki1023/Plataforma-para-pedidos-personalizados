const pool = require('../config/db');

exports.getProducts = async () => {
  const result = await pool.query(`
    SELECT 
      id,
      nombre,
      precio,
      categoria,
      disponible,
      imagen_url,
      stock
    FROM producto
    WHERE disponible = true
    ORDER BY id ASC
  `);

  return result.rows;
};

exports.getProductById = async (id) => {
  const productResult = await pool.query(`
    SELECT 
      id,
      nombre,
      precio,
      categoria,
      disponible,
      imagen_url,
      stock
    FROM producto
    WHERE id= $1 AND disponible = true
  `,[id]);

  if(productResult.rows.length === 0){
    throw new Error('Producto no encontrado')
  }

  const optionsResult = await pool.query(`
    SELECT
      id,
      nombre,
      precio_adicional
    FROM opcion_producto
    WHERE id_producto = $1
    ORDER BY id ASC
  `, [id]);

  const product = productResult.rows[0];

  product.opciones = optionsResult.rows;

  return product;
};