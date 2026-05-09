const userService = require('../services/user.service');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userService.getUserProfile(userId);
    res.json({
      user: {
        id: user.id,
        usuario: user.usuario,
        email: user.email,
        fecha_nacimiento: user.fecha_nacimiento,
        sexo: user.sexo,
        telefono: user.telefono,
        rol: user.id_rol,
        fecha_registro: user.fecha_registro
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedUser = await userService.updateUserProfile(userId, req.body);
    res.json({
      message: 'Perfil actualizado exitosamente',
      user: {
        id: updatedUser.id,
        usuario: updatedUser.usuario,
        email: updatedUser.email,
        fecha_nacimiento: updatedUser.fecha_nacimiento,
        sexo: updatedUser.sexo,
        telefono: updatedUser.telefono,
        rol: updatedUser.id_rol
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};