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
        telefono: user.telefono,
        fecha_nacimiento: user.fecha_nacimiento,
        sexo: user.sexo,
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
        id_rol: user.id_rol // Cambiado de 'rol' a 'id_rol'
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
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.resendVerification(email);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
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

// NEW: Verify reset code endpoint (was missing - root cause of the bug)
exports.verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const userId = req.user?.id || null;
    const result = await authService.verifyResetCode(userId, email, code);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

exports.changePassword = async (req, res) => {

  try {

    const userId = req.user?.id || null; // Allow null for forgot-password flow
    const {
      email,
      code,
      newPassword
    } = req.body;

    // Validar que el email pertenece al usuario autenticado
    const result =
      await authService.changePassword(
        userId,
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