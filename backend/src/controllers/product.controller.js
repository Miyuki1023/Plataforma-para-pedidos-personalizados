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
      return res.status(400).json({
        message: 'ID de producto inválido'
      });
    }

    const product = await productService.getProductById(id);

    res.json(product);

  } catch (error) {

    console.error(error);

    if (error.message === 'Producto no encontrado') {
      return res.status(404).json({
        message: error.message
      });
    }

    res.status(500).json({
      message: 'Error al obtener el producto'
    });

  }

};

exports.createProduct = async (req, res) => {

  try {

    const {
      nombre,
      precio,
      categoria,
      stock,
      imagenUrls,
      descripcion
    } = req.body;

    // Validaciones básicas
    if (
      !nombre ||
      precio === undefined ||
      !categoria ||
      stock === undefined
    ) {
      return res.status(400).json({
        message:
          'Los campos nombre, precio, categoria y stock son requeridos'
      });
    }

    if (
      typeof nombre !== 'string' ||
      typeof precio !== 'number' ||
      typeof stock !== 'number'
    ) {
      return res.status(400).json({
        message: 'Tipos de datos inválidos'
      });
    }

    const product = await productService.createProduct(
      nombre,
      precio,
      categoria,
      stock,
      imagenUrls,
      descripcion
    );

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product
    });

  } catch (error) {

    console.error(error);

    if (
      error.message.includes('Máximo 3 imágenes')
    ) {
      return res.status(400).json({
        message: error.message
      });
    }

    res.status(500).json({
      message: 'Error al crear el producto'
    });

  }

};

exports.updateProduct = async (req, res) => {

  try {

    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: 'ID de producto inválido'
      });
    }

    const updateData = req.body;

    const product = await productService.updateProduct(
      id,
      updateData
    );

    res.json({
      message: 'Producto actualizado exitosamente',
      product
    });

  } catch (error) {

    console.error(error);

    if (
      error.message === 'Producto no encontrado'
    ) {
      return res.status(404).json({
        message: error.message
      });
    }

    if (
      error.message.includes('Máximo 3 imágenes')
    ) {
      return res.status(400).json({
        message: error.message
      });
    }

    if (
      error.message.includes('No hay campos')
    ) {
      return res.status(400).json({
        message: error.message
      });
    }

    res.status(500).json({
      message: 'Error al actualizar producto'
    });

  }

};

exports.deleteProduct = async (req, res) => {

  try {

    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: 'ID de producto inválido'
      });
    }

    const result = await productService.deleteProduct(id);

    res.json({
      message: 'Producto eliminado exitosamente',
      product: result
    });

  } catch (error) {

    console.error(error);

    if (
      error.message === 'Producto no encontrado'
    ) {
      return res.status(404).json({
        message: error.message
      });
    }

    res.status(500).json({
      message: 'Error al eliminar producto'
    });

  }

};

exports.updateStock = async (req, res) => {

  try {

    const id = parseInt(req.params.id);

    const { cantidad } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        message: 'ID inválido'
      });
    }

    if (
      cantidad === undefined ||
      typeof cantidad !== 'number'
    ) {
      return res.status(400).json({
        message: 'Cantidad inválida'
      });
    }

    const updatedProduct =
      await productService.updateStock(
        id,
        cantidad
      );

    res.json({
      message: 'Stock actualizado',
      product: updatedProduct
    });

  } catch (error) {

    console.error(error);

    if (
      error.message === 'Producto no encontrado'
    ) {
      return res.status(404).json({
        message: error.message
      });
    }

    if (
      error.message === 'Stock insuficiente'
    ) {
      return res.status(400).json({
        message: error.message
      });
    }

    res.status(500).json({
      message: 'Error al actualizar stock'
    });

  }

};

// ========================
// Opciones personalizadas
// ========================

exports.getProductOptions = async (req, res) => {

  try {

    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({
        message: 'ID de producto inválido'
      });
    }

    const options =
      await productService.getProductOptions(
        productId
      );

    res.json(options);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        'Error al obtener opciones de personalización'
    });

  }

};

exports.createProductOption = async (req, res) => {

  try {

    const productId = parseInt(req.params.id);

    const {
      nombre,
      precio_adicional
    } = req.body;

    if (isNaN(productId)) {
      return res.status(400).json({
        message: 'ID de producto inválido'
      });
    }

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        message:
          'El nombre de la opción es requerido'
      });
    }

    if (
      precio_adicional === undefined ||
      precio_adicional === null
    ) {
      return res.status(400).json({
        message:
          'El precio adicional es requerido'
      });
    }

    if (
      typeof precio_adicional !== 'number'
    ) {
      return res.status(400).json({
        message:
          'El precio adicional debe ser numérico'
      });
    }

    const option =
      await productService.createProductOption(
        productId,
        nombre,
        precio_adicional
      );

    res.status(201).json({
      message:
        'Opción creada exitosamente',
      option
    });

  } catch (error) {

    console.error(error);

    if (
      error.message === 'Producto no encontrado'
    ) {
      return res.status(404).json({
        message: error.message
      });
    }

    res.status(500).json({
      message:
        'Error al crear opción personalizada'
    });

  }

};

exports.updateProductOption = async (req, res) => {

  try {

    const optionId = parseInt(
      req.params.optionId
    );

    const {
      nombre,
      precio_adicional
    } = req.body;

    if (isNaN(optionId)) {
      return res.status(400).json({
        message: 'ID de opción inválido'
      });
    }

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        message:
          'El nombre de la opción es requerido'
      });
    }

    if (
      precio_adicional === undefined ||
      precio_adicional === null
    ) {
      return res.status(400).json({
        message:
          'El precio adicional es requerido'
      });
    }

    if (
      typeof precio_adicional !== 'number'
    ) {
      return res.status(400).json({
        message:
          'El precio adicional debe ser numérico'
      });
    }

    const option =
      await productService.updateProductOption(
        optionId,
        nombre,
        precio_adicional
      );

    res.json({
      message:
        'Opción actualizada exitosamente',
      option
    });

  } catch (error) {

    console.error(error);

    if (
      error.message === 'Opción no encontrada'
    ) {
      return res.status(404).json({
        message: error.message
      });
    }

    res.status(500).json({
      message:
        'Error al actualizar opción'
    });

  }

};

exports.deleteProductOption = async (req, res) => {

  try {

    const optionId = parseInt(
      req.params.optionId
    );

    if (isNaN(optionId)) {
      return res.status(400).json({
        message: 'ID de opción inválido'
      });
    }

    const result =
      await productService.deleteProductOption(
        optionId
      );

    res.json({
      message:
        'Opción eliminada exitosamente',
      option: result
    });

  } catch (error) {

    console.error(error);

    if (
      error.message === 'Opción no encontrada'
    ) {
      return res.status(404).json({
        message: error.message
      });
    }

    res.status(500).json({
      message:
        'Error al eliminar opción'
    });

  }

};