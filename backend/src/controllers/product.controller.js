const productService = require('../services/product.service');

exports.getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts();

    res.json(products);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error al obtener productos'
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID de producto inválido' });
    }

    const product = await productService.getProductById(id);

    res.json(product);

  } catch (error) {
    console.error(error);

    if (error.message === 'Producto no encontrado') {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({
      message: 'Error al obtener el producto'
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    let { nombre, precio, categoria, stock, imagenUrls, descripcion } = req.body;

    // Validar campos requeridos
    if (!nombre || precio === undefined || precio === null || !categoria || stock === undefined || stock === null) {
      return res.status(400).json({
        message: 'Los campos nombre, precio, categoria y stock son requeridos'
      });
    }

    // Convertir a números para soportar strings y decimales (permitir 0)
    const finalPrecio = Number(precio);
    const finalStock = Number(stock);

    if (isNaN(finalPrecio) || isNaN(finalStock)) {
      return res.status(400).json({ message: 'El precio y el stock deben ser valores numéricos' });
    }

    const product = await productService.createProduct(
      nombre,
      finalPrecio,
      categoria,
      finalStock,
      imagenUrls,
      descripcion
    );

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product
    });

  } catch (error) {
    console.error(error);

    if (error.message.includes('máximo de 3 URLs')) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({
      message: 'Error al crear el producto'
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updateData = req.body;

    // Asegurar que los campos numéricos sean tratados como tales (permitir decimales y 0)
    if (updateData.precio !== undefined && updateData.precio !== null) {
      updateData.precio = Number(updateData.precio);
      if (isNaN(updateData.precio)) return res.status(400).json({ message: 'El precio debe ser un valor numérico' });
    }

    if (updateData.stock !== undefined && updateData.stock !== null) {
      updateData.stock = Number(updateData.stock);
      if (isNaN(updateData.stock)) return res.status(400).json({ message: 'El stock debe ser un valor numérico' });
    }

    // Log para depuración en consola del servidor
    console.log(`Intentando actualizar producto ID: ${id}`);
    console.log('Datos recibidos:', updateData);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID de producto inválido' });
    }

    const product = await productService.updateProduct(id, updateData);

    res.json({
      message: 'Producto actualizado exitosamente',
      product
    });

  } catch (error) {
    console.error(error);

    if (error.message === 'Producto no encontrado') {
      return res.status(404).json({ message: error.message });
    }

    if (error.message.includes('máximo de 3 URLs')) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({
      message: `Error al actualizar producto ${id}: ${error.message}`
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID de producto inválido' });
    }

    const result = await productService.deleteProduct(id);

    res.json({
      message: 'Producto eliminado exitosamente',
      product: result
    });

  } catch (error) {
    console.error(error);

    if (error.message === 'Producto no encontrado') {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({
      message: 'Error al eliminar el producto'
    });
  }
};

// ======================== Opciones de Producto ========================

exports.getProductOptions = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({ message: 'ID de producto inválido' });
    }

    const options = await productService.getProductOptions(productId);

    res.json(options);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error al obtener las opciones de personalización'
    });
  }
};

exports.createProductOption = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { nombre, precio_adicional } = req.body;

    if (isNaN(productId)) {
      return res.status(400).json({ message: 'ID de producto inválido' });
    }

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ message: 'El nombre de la opción es requerido' });
    }

    const finalPrecio = parseFloat(precio_adicional);

    if (isNaN(finalPrecio)) {
      return res.status(400).json({ message: 'El precio adicional es requerido y debe ser un valor numérico' });
    }

    const option = await productService.createProductOption(
      productId,
      nombre,
      finalPrecio
    );

    res.status(201).json({
      message: 'Opción de personalización creada exitosamente',
      option
    });

  } catch (error) {
    console.error(error);

    if (error.message === 'Producto no encontrado') {
      return res.status(404).json({ message: error.message });
    }

    if (error.message.includes('requerido')) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({
      message: 'Error al crear la opción de personalización'
    });
  }
};

exports.updateProductOption = async (req, res) => {
  try {
    const optionId = parseInt(req.params.optionId);
    const { nombre, precio_adicional } = req.body;

    if (isNaN(optionId)) {
      return res.status(400).json({ message: 'ID de opción inválido' });
    }

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ message: 'El nombre de la opción es requerido' });
    }

    const finalPrecio = parseFloat(precio_adicional);

    if (isNaN(finalPrecio)) {
      return res.status(400).json({ message: 'El precio adicional es requerido y debe ser un valor numérico' });
    }

    const option = await productService.updateProductOption(
      optionId,
      nombre,
      finalPrecio
    );

    res.json({
      message: 'Opción de personalización actualizada exitosamente',
      option
    });

  } catch (error) {
    console.error(error);

    if (error.message === 'Opción de producto no encontrada') {
      return res.status(404).json({ message: error.message });
    }

    if (error.message.includes('requerido')) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({
      message: 'Error al actualizar la opción de personalización'
    });
  }
};

exports.deleteProductOption = async (req, res) => {
  try {
    const optionId = parseInt(req.params.optionId);

    if (isNaN(optionId)) {
      return res.status(400).json({ message: 'ID de opción inválido' });
    }

    const result = await productService.deleteProductOption(optionId);

    res.json({
      message: 'Opción de personalización eliminada exitosamente',
      option: result
    });

  } catch (error) {
    console.error(error);

    if (error.message === 'Opción de producto no encontrada') {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({
      message: 'Error al eliminar la opción de personalización'
    });
  }
};