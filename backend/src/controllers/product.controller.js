const productService = require('../services/product.service');

exports.getProducts = async (req, res) => {
  try {
    const { limit, offset, fields, search, categoria } = req.query;
    const products = await productService.getProducts({ limit, offset, fields, search, categoria });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al obtener productos',
      details: error.message
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el producto', details: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({
      message: 'Producto creado exitosamente',
      product
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.updateProduct(id, req.body);
    res.json({ message: 'Producto actualizado', product });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createOption = async (req, res) => {
  try {
    const { id } = req.params;
    const option = await productService.createOption(id, req.body);
    res.status(201).json(option);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProductOptions = async (req, res) => {
  try {
    const { id } = req.params;
    const options = await productService.getProductOptions(id);
    res.json(options);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener opciones', details: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productService.deleteProduct(id);

    if (!result) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Error al eliminar el producto', 
      details: error.message 
    });
  }
};