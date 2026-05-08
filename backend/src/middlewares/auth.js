const jwt = require('jsonwebtoken');
const tokenBlacklist = new Set();

const verifyToken = (req, res, next) => {
  // Extraer token del header Authorization
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  // Verificar si el token está en la lista negra
  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    if (req.user.rol !== requiredRole) {
      return res.status(403).json({ message: 'Acceso denegado: rol insuficiente' });
    }

    next();
  };
};

const requireAdmin = requireRole('admin');

const addToBlacklist = (token) => {
  tokenBlacklist.add(token);
};

const isTokenBlacklisted = (token) => {
  return tokenBlacklist.has(token);
};

module.exports = {
  verifyToken,
  requireRole,
  requireAdmin,
  addToBlacklist,
  isTokenBlacklisted
};
