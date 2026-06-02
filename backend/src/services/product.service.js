const pool = require('../config/db');

exports.getProducts = async () => {
  const result = await pool.query(`
    SELECT 
      p.id,
      p.nombre,
      p.precio,
      p.categoria,
      p.disponible,
      p.imagen_url,
      p.stock,
      p.descripcion,
      COALESCE(SUM(dp.cantidad), 0)::int as vendidos
    FROM producto p
    LEFT JOIN detalle_pedido dp ON p.id = dp.id_producto
    GROUP BY p.id
    ORDER BY p.disponible DESC, p.id ASC
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

  // Obtener opciones de personalización
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

exports.createProductOption = async (idProducto, nombre, precioAdicional) => {
  // Validar que el producto existe
  const productCheck = await pool.query(
    'SELECT id FROM producto WHERE id = $1',
    [idProducto]
  );

  if (productCheck.rows.length === 0) {
    throw new Error('Producto no encontrado');
  }

  // Validar campos requeridos
  if (!nombre || nombre.trim() === '') {
    throw new Error('El nombre de la opción es requerido');
  }

  if (precioAdicional === undefined || precioAdicional === null) {
    throw new Error('El precio adicional es requerido');
  }

  const result = await pool.query(`
    INSERT INTO opcion_producto (id_producto, nombre, precio_adicional)
    VALUES ($1, $2, $3)
    RETURNING id, id_producto, nombre, precio_adicional
  `, [idProducto, nombre.trim(), precioAdicional]);

  return result.rows[0];
};

exports.updateProductOption = async (id, nombre, precioAdicional) => {
  // Validar campos
  if (!nombre || nombre.trim() === '') {
    throw new Error('El nombre de la opción es requerido');
  }

  if (precioAdicional === undefined || precioAdicional === null) {
    throw new Error('El precio adicional es requerido');
  }

  const result = await pool.query(`
    UPDATE opcion_producto
    SET nombre = $1, precio_adicional = $2
    WHERE id = $3
    RETURNING id, id_producto, nombre, precio_adicional
  `, [nombre.trim(), precioAdicional, id]);

  if (result.rows.length === 0) {
    throw new Error('Opción de producto no encontrada');
  }

  return result.rows[0];
};

exports.deleteProductOption = async (id) => {
  const result = await pool.query(`
    DELETE FROM opcion_producto
    WHERE id = $1
    RETURNING id, id_producto, nombre
  `, [id]);

  if (result.rows.length === 0) {
    throw new Error('Opción de producto no encontrada');
  }

  return result.rows[0];
};

exports.createProduct = async (nombre, precio, categoria, stock, imagenUrls = [], descripcion = '') => {
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    throw new Error('El nombre del producto es requerido');
  }

  if (precio === undefined || precio === null || typeof precio !== 'number') {
    throw new Error('El precio del producto es requerido y debe ser un número');
  }

  if (!categoria || typeof categoria !== 'string' || categoria.trim() === '') {
    throw new Error('La categoría del producto es requerida');
  }

  if (stock === undefined || stock === null || typeof stock !== 'number') {
    throw new Error('El stock del producto es requerido y debe ser un número');
  }

  if (!Array.isArray(imagenUrls)) {
    imagenUrls = [imagenUrls];
  }

  if (imagenUrls.length > 3) {
    throw new Error('Se permite un máximo de 3 URLs de imagen');
  }

  imagenUrls = imagenUrls.filter(url => url && typeof url === 'string' && url.trim() !== '');

  const result = await pool.query(`
    INSERT INTO producto (nombre, precio, categoria, stock, imagen_url, disponible, descripcion)
    VALUES ($1, $2, $3, $4, $5, true, $6)
    RETURNING id, nombre, precio, categoria, disponible, imagen_url, stock, descripcion
  `, [nombre.trim(), precio, categoria.trim(), stock, imagenUrls, descripcion]);

  return result.rows[0];
};

exports.updateProduct = async (id, updateData) => {
  // Extraemos tanto imagenUrls (frontend) como imagen_url (db)
  const { nombre, precio, categoria, stock, imagenUrls, imagen_url, disponible, descripcion } = updateData;

  // Validate imagen_url array if provided
  let finalImages = imagenUrls !== undefined ? imagenUrls : imagen_url;
  let validImagenUrls = finalImages;
  
  if (finalImages !== undefined) {
    if (!Array.isArray(finalImages)) {
      validImagenUrls = [finalImages];
    }
    
    // Ensure maximum 3 URLs
    if (validImagenUrls && validImagenUrls.length > 3) {
      throw new Error('Se permite un máximo de 3 URLs de imagen');
    }

    // Filter out null and empty strings
    validImagenUrls = validImagenUrls.filter(url => url && url.trim() !== '');
  }

  // Build dynamic update query
  const updateFields = [];
  const values = [];
  let paramCounter = 1;

  if (nombre !== undefined) {
    updateFields.push(`nombre = $${paramCounter}`);
    values.push(nombre);
    paramCounter++;
  }

  if (precio !== undefined) {
    updateFields.push(`precio = $${paramCounter}`);
    values.push(precio);
    paramCounter++;
  }

  if (categoria !== undefined) {
    updateFields.push(`categoria = $${paramCounter}`);
    values.push(categoria);
    paramCounter++;
  }

  if (stock !== undefined) {
    updateFields.push(`stock = $${paramCounter}`);
    values.push(stock);
    paramCounter++;
  }

  if (finalImages !== undefined) {
    updateFields.push(`imagen_url = $${paramCounter}`);
    values.push(validImagenUrls);
    paramCounter++;
  }

  if (disponible !== undefined) {
    updateFields.push(`disponible = $${paramCounter}`);
    values.push(disponible);
    paramCounter++;
  }

  // Permitir actualizar descripción incluso si viene como string vacío
  if (descripcion !== undefined) {
    updateFields.push(`descripcion = $${paramCounter}`);
    values.push(descripcion);
    paramCounter++;
  }

  if (updateFields.length === 0) {
    throw new Error('No hay campos para actualizar');
  }

  values.push(id);

  const query = `
    UPDATE producto
    SET ${updateFields.join(', ')}
    WHERE id = $${paramCounter}
    RETURNING id, nombre, precio, categoria, disponible, imagen_url, stock, descripcion
  `;

  // Log para verificar la consulta exacta que se envía a PostgreSQL
  console.log('Ejecutando SQL:', query);
  console.log('Con valores:', values);

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