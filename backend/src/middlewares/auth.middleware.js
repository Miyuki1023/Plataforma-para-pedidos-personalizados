const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Desarrollo: permitir bypass de autenticación para pruebas locales.
  // Configura BYPASS_AUTH=true en tu .env para entrar forzado en la sección de empleado.
  if (process.env.NODE_ENV !== 'production' && process.env.BYPASS_AUTH === 'true') {
    req.user = {
      id: 1,
      rol: 2 // 2 = empleado, permite acceder a la sección de pedidos de empleado
    };
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no provisto' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, rol: payload.rol };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};