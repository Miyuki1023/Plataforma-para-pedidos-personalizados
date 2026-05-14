const pool = require('../config/db');

// =========================
// PRODUCTOS
// =========================

exports.getProducts = async () => {
  const result = await pool.query(`
    SELECT 
      id,
      nombre,
      precio,
      categoria,
      disponible,
      imagen_url,
      stock,
      descripcion
    FROM producto
    WHERE disponible = true
    ORDER BY id ASC
  `);

  return result.rows;
};

exports.getProductById = async (id) => {
  const result = await pool.query(`
    SELECT 
      id,
      nombre,
      precio,
      categoria,
      disponible,
      imagen_url,
      stock,
      descripcion
    FROM producto
    WHERE id = $1
  `, [id]);

  if (result.rows.length === 0) {
    throw new Error('Producto no encontrado');
  }

  const product = result.rows[0];

  const optionsResult = await pool.query(`
    SELECT 
      id,
      id_producto,
      nombre,
      precio_adicional
    FROM opcion_producto
    WHERE id_producto = $1
    ORDER BY nombre ASC
  `, [id]);

  product.opciones = optionsResult.rows;

  return product;
};

exports.createProduct = async (
  nombre,
  precio,
  categoria,
  stock,
  imagenUrls = [],
  descripcion = ''
) => {

  if (!Array.isArray(imagenUrls)) {
    imagenUrls = [imagenUrls];
  }

  if (imagenUrls.length > 3) {
    throw new Error('Máximo 3 imágenes');
  }

  imagenUrls = imagenUrls.filter(
    url => url && url.trim() !== ''
  );

  const result = await pool.query(`
    INSERT INTO producto
    (
      nombre,
      precio,
      categoria,
      stock,
      imagen_url,
      disponible,
      descripcion
    )
    VALUES ($1, $2, $3, $4, $5, true, $6)
    RETURNING
      id,
      nombre,
      precio,
      categoria,
      disponible,
      imagen_url,
      stock,
      descripcion
  `, [
    nombre,
    precio,
    categoria,
    stock,
    imagenUrls,
    descripcion
  ]);

  return result.rows[0];
};

exports.updateProduct = async (id, updateData) => {

  const {
    nombre,
    precio,
    categoria,
    stock,
    imagenUrls,
    disponible,
    descripcion
  } = updateData;

  const fields = [];
  const values = [];

  let count = 1;

  if (nombre !== undefined) {
    fields.push(`nombre = $${count++}`);
    values.push(nombre);
  }

  if (precio !== undefined) {
    fields.push(`precio = $${count++}`);
    values.push(precio);
  }

  if (categoria !== undefined) {
    fields.push(`categoria = $${count++}`);
    values.push(categoria);
  }

  if (stock !== undefined) {
    fields.push(`stock = $${count++}`);
    values.push(stock);
  }

  if (imagenUrls !== undefined) {

    let validUrls = imagenUrls;

    if (!Array.isArray(validUrls)) {
      validUrls = [validUrls];
    }

    if (validUrls.length > 3) {
      throw new Error('Máximo 3 imágenes');
    }

    validUrls = validUrls.filter(
      url => url && url.trim() !== ''
    );

    fields.push(`imagen_url = $${count++}`);
    values.push(validUrls);
  }

  if (disponible !== undefined) {
    fields.push(`disponible = $${count++}`);
    values.push(disponible);
  }

  if (descripcion !== undefined) {
    fields.push(`descripcion = $${count++}`);
    values.push(descripcion);
  }

  if (fields.length === 0) {
    throw new Error('No hay datos para actualizar');
  }

  values.push(id);

  const query = `
    UPDATE producto
    SET ${fields.join(', ')}
    WHERE id = $${count}
    RETURNING
      id,
      nombre,
      precio,
      categoria,
      disponible,
      imagen_url,
      stock,
      descripcion
  `;

  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    throw new Error('Producto no encontrado');
  }

  return result.rows[0];
};

exports.deleteProduct = async (id) => {
  const result = await pool.query(`
    DELETE FROM producto
    WHERE id = $1
    RETURNING id, nombre
  `, [id]);

  if (result.rows.length === 0) {
    throw new Error('Producto no encontrado');
  }

  return result.rows[0];
};

// =========================
// STOCK
// =========================

exports.updateStock = async (id, cantidad) => {

  const result = await pool.query(`
    UPDATE producto
    SET stock = $1
    WHERE id = $2
    RETURNING
      id,
      nombre,
      stock
  `, [cantidad, id]);

  if (result.rows.length === 0) {
    throw new Error('Producto no encontrado');
  }

  return result.rows[0];
};

// =========================
// OPCIONES
// =========================

exports.getProductOptions = async (idProducto) => {

  const result = await pool.query(`
    SELECT
      id,
      id_producto,
      nombre,
      precio_adicional
    FROM opcion_producto
    WHERE id_producto = $1
    ORDER BY nombre ASC
  `, [idProducto]);

  return result.rows;
};

exports.createProductOption = async (
  idProducto,
  nombre,
  precioAdicional
) => {

  const productCheck = await pool.query(
    'SELECT id FROM producto WHERE id = $1',
    [idProducto]
  );

  if (productCheck.rows.length === 0) {
    throw new Error('Producto no encontrado');
  }

  const result = await pool.query(`
    INSERT INTO opcion_producto
    (
      id_producto,
      nombre,
      precio_adicional
    )
    VALUES ($1, $2, $3)
    RETURNING
      id,
      id_producto,
      nombre,
      precio_adicional
  `, [
    idProducto,
    nombre,
    precioAdicional
  ]);

  return result.rows[0];
};

exports.updateProductOption = async (
  id,
  nombre,
  precioAdicional
) => {

  const result = await pool.query(`
    UPDATE opcion_producto
    SET
      nombre = $1,
      precio_adicional = $2
    WHERE id = $3
    RETURNING
      id,
      id_producto,
      nombre,
      precio_adicional
  `, [
    nombre,
    precioAdicional,
    id
  ]);

  if (result.rows.length === 0) {
    throw new Error('Opción no encontrada');
  }

  return result.rows[0];
};

exports.deleteProductOption = async (id) => {

  const result = await pool.query(`
    DELETE FROM opcion_producto
    WHERE id = $1
    RETURNING id, nombre
  `, [id]);

  if (result.rows.length === 0) {
    throw new Error('Opción no encontrada');
  }

  return result.rows[0];
};