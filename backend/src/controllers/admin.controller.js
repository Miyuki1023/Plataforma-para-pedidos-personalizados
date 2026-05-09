const adminService = require('../services/admin.service');

exports.getAllUsers = async (req, res) => {
  try {
    const adminId = req.user.id;
    const users = await adminService.getAllUsers(adminId);
    res.json({
      users: users.map(user => ({
        id: user.id,
        usuario: user.usuario,
        email: user.email,
        fecha_nacimiento: user.fecha_nacimiento,
        sexo: user.sexo,
        telefono: user.telefono,
        rol: user.id_rol,
        activo: user.activo,
        fecha_registro: user.fecha_registro
      }))
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const adminId = req.user.id;
    const targetUserId = parseInt(req.params.id);

    if (isNaN(targetUserId)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    const user = await adminService.getUserById(adminId, targetUserId);
    res.json({
      user: {
        id: user.id,
        usuario: user.usuario,
        email: user.email,
        fecha_nacimiento: user.fecha_nacimiento,
        sexo: user.sexo,
        telefono: user.telefono,
        rol: user.id_rol,
        activo: user.activo,
        fecha_registro: user.fecha_registro
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const adminId = req.user.id;
    const targetUserId = parseInt(req.params.id);
    const rol = parseInt(req.body.rol);

    if (isNaN(targetUserId)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    if (isNaN(rol)) {
      return res.status(400).json({ message: 'El campo rol debe ser un número válido' });
    }

    const result = await adminService.updateUserRole(adminId, targetUserId, rol);
    res.json({
      message: result.message,
      user: {
        id: result.user.id,
        usuario: result.user.usuario,
        email: result.user.email,
        rol: result.user.id_rol
      },
      changes: {
        previousRole: result.previousRole,
        newRole: result.newRole
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.activateUser = async (req, res) => {
  try {
    const adminId = req.user.id;
    const targetUserId = parseInt(req.params.id);

    if (isNaN(targetUserId)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    const result = await adminService.toggleUserStatus(adminId, targetUserId, true);
    res.json({
      message: result.message,
      user: {
        id: result.user.id,
        usuario: result.user.usuario,
        email: result.user.email,
        activo: result.user.activo
      },
      changes: {
        previousStatus: result.previousStatus,
        newStatus: result.newStatus
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    const adminId = req.user.id;
    const targetUserId = parseInt(req.params.id);

    if (isNaN(targetUserId)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    const result = await adminService.toggleUserStatus(adminId, targetUserId, false);
    res.json({
      message: result.message,
      user: {
        id: result.user.id,
        usuario: result.user.usuario,
        email: result.user.email,
        activo: result.user.activo
      },
      changes: {
        previousStatus: result.previousStatus,
        newStatus: result.newStatus
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};