const authService = require('../services/auth.service');

exports.register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        usuario: user.usuario,
        email: user.email,
        rol: user.id_rol
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const data = await authService.login(req.body);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.token;
    const result = await authService.logout(token);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.adminRegister = async (req, res) => {
  try {
    const adminId = req.user.id; // From the authenticated admin
    const user = await authService.adminRegister(req.body, adminId);
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: {
        id: user.id,
        usuario: user.usuario,
        email: user.email,
        rol: user.id_rol
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};