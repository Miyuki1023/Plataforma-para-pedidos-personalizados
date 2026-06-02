const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Desarrollo: permitir bypass de autenticación para pruebas locales.
  // Configura BYPASS_AUTH=true en tu .env para entrar forzado en la sección de empleado.
  const rawBypass = process.env.BYPASS_AUTH;
  const isBypassActive = rawBypass === 'true' || rawBypass === true || String(rawBypass).trim().toLowerCase() === 'true';
  
  console.log(`[AUTH-WORKER] Solicitud: ${req.method} ${req.originalUrl}`);
  console.log(`[AUTH-WORKER] BYPASS_AUTH en .env: "${rawBypass}" -> Activo: ${isBypassActive}`);

  if (isBypassActive) {
    console.log(`[AUTH-WORKER] Aplicando Bypass para usuario ID 1 (Admin)`);
    req.user = {
      id: 1,
      rol: 3 // 3 = Administrador, da acceso total a todas las rutas (Admin, Empleado, Cliente)
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