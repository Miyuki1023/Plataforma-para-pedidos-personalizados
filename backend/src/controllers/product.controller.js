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

    const { id } = req.params;

    const product = await productService.getProductById(id);

    res.json(product);

  } catch (error) {

    console.error(error);

    res.status(404).json({
      message: error.message
    });

  }

};