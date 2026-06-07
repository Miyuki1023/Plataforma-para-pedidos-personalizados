const categoryService = require('../services/categories.service');

exports.getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error al obtener categorías', details: error.message });
  }
};