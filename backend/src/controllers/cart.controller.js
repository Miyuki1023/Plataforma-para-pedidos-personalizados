const cartService = require('../services/cart.service');

exports.createCart = async (req, res) => {
  try {
    const cart = await cartService.getOrCreateCart(req.user.id);
    res.status(201).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const data = await cartService.getCartByUser(req.user.id);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addItem = async (req, res) => {
  try {
    const item = await cartService.addItem({
      userId: req.user.id,
      productoId: req.body.productoId,
      cantidad: req.body.cantidad,
      opciones: req.body.opciones
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await cartService.updateItem({
      userId: req.user.id,
      itemId: Number(req.params.itemId),
      cantidad: req.body.cantidad,
      opciones: req.body.opciones
    });

    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const item = await cartService.removeItem({
      userId: req.user.id,
      itemId: Number(req.params.itemId)
    });

    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.syncCart = async (req, res) => {
  try {
    const data = await cartService.syncCart({
      userId: req.user.id,
      items: req.body.items
    });

    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
