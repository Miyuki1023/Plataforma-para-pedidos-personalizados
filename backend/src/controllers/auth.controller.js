const authService = require('../services/auth.service');

exports.register = async (req, res) => {

  console.log('BODY RECIBIDO:', req.body);

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
    const adminId = req.user.id; // Del admin autenticado
    const { rol, ...userData } = req.body;
    const rolNum = parseInt(rol);
    if (isNaN(rolNum)) {
      return res.status(400).json({ message: 'Rol debe ser un número válido' });
    }
    const user = await authService.adminRegister({ ...userData, rol: rolNum }, adminId);
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

exports.verifyAccount = async (req, res) => {

  try {

    const { email, code } = req.body;

    const result = await authService.verifyAccount(
      email,
      code
    );

    res.json(result);

  } catch (error) {

    console.error(error);

    if (
      error.message === 'Usuario no encontrado' ||
      error.message === 'Código incorrecto' ||
      error.message === 'Código expirado' ||
      error.message === 'La cuenta ya está verificada'
    ) {
      return res.status(400).json({
        message: error.message
      });
    }

    res.status(500).json({
      message: 'Error al verificar cuenta'
    });

  }

};

//TEMA DE CAMBIAR CONTRA
exports.forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    const result =
      await authService.forgotPassword(
        email
      );

    res.json(result);

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }

};

exports.changePassword = async (req, res) => {

  try {

    const {
      email,
      code,
      newPassword
    } = req.body;

    const result =
      await authService.changePassword(
        email,
        code,
        newPassword
      );

    res.json(result);

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }

};