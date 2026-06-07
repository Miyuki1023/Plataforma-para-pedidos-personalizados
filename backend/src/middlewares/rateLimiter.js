/**
 * Rate Limiter Middleware
 * Protege contra ataques de fuerza bruta limitando peticiones por IP/usuario
 */

const rateLimitStore = new Map();

/**
 * Crear limitador para una clave específica
 * @param {string} key - Identificador único (e.g., IP + email)
 * @param {number} maxAttempts - Máximo de intentos permitidos
 * @param {number} windowMs - Ventana de tiempo en milisegundos
 */
const createRateLimiter = (key, maxAttempts, windowMs) => {
  return (req, res, next) => {
    const now = Date.now();
    const limiterKey = key(req);
    
    let record = rateLimitStore.get(limiterKey);

    // Crear nuevo registro si no existe
    if (!record) {
      record = {
        attempts: 1,
        resetTime: now + windowMs,
        blocked: false
      };
      rateLimitStore.set(limiterKey, record);
      return next();
    }

    // Resetear si la ventana pasó
    if (now > record.resetTime) {
      record.attempts = 1;
      record.resetTime = now + windowMs;
      record.blocked = false;
      return next();
    }

    // Incrementar intentos
    record.attempts++;

    // Bloquear si se excede el límite
    if (record.attempts > maxAttempts) {
      record.blocked = true;
      const remainingTime = Math.ceil((record.resetTime - now) / 1000);
      
      return res.status(429).json({
        message: `Demasiados intentos. Intenta de nuevo en ${remainingTime} segundos.`,
        retryAfter: remainingTime
      });
    }

    next();
  };
};

/**
 * Limitador para forgot-password: máximo 3 intentos por email cada 15 minutos
 */
const forgotPasswordLimiter = createRateLimiter(
  (req) => `forgot-password:${req.body.email}`,
  3,           // máximo 3 intentos
  15 * 60 * 1000  // ventana de 15 minutos
);

/**
 * Limitador para change-password: máximo 5 intentos por usuario cada 30 minutos
 */
const changePasswordLimiter = createRateLimiter(
  (req) => `change-password:${req.user?.id || req.body.email}`,
  5,           // máximo 5 intentos
  30 * 60 * 1000  // ventana de 30 minutos
);

/**
 * Limitador para login: máximo 5 intentos por IP cada 15 minutos
 */
const loginLimiter = createRateLimiter(
  (req) => `login:${req.ip}`,
  5,           // máximo 5 intentos
  15 * 60 * 1000  // ventana de 15 minutos
);

/**
 * Limitador general por IP: máximo 100 peticiones por minuto
 */
const generalLimiter = createRateLimiter(
  (req) => `general:${req.ip}`,
  100,         // máximo 100 peticiones
  60 * 1000    // ventana de 1 minuto
);

// Limpiar registros antiguos cada hora
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime + 60 * 60 * 1000) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 60 * 1000);

module.exports = {
  forgotPasswordLimiter,
  changePasswordLimiter,
  loginLimiter,
  generalLimiter,
  createRateLimiter
};
