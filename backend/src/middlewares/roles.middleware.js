// Middleware de roles - verifica si el usuario tiene el rol requerido
// Roles: 1 = Cliente, 2 = Trabajador, 3 = Admin

const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    next();
  };
};

module.exports = { checkRole };