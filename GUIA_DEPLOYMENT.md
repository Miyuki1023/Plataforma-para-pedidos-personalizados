# 📋 GUÍA RÁPIDA DE DEPLOYMENT

## 🎯 Lo Que Se Hizo

Se corrigieron **7 vulnerabilidades críticas de seguridad** en el sistema de perfil de usuario:

1. ✅ Órdenes ahora vienen del servidor (no localStorage)
2. ✅ Favoritos ahora vienen del servidor (no localStorage)
3. ✅ Rutas admin protegidas con JWT
4. ✅ Change-password requiere JWT
5. ✅ Rate limiting en forget-password y login
6. ✅ Validación fuerte de contraseñas
7. ✅ Bloqueo tras intentos fallidos

---

## 🚀 PASOS DE DEPLOYMENT

### Paso 1: Revisar Cambios (5 min)

**Backend - Archivos Modificados:**
- ✅ `backend/src/routes/auth.routes.js` - Agregado rate limiters
- ✅ `backend/src/routes/admin.routes.js` - Agregada autenticación
- ✅ `backend/src/controllers/auth.controller.js` - change-password con userId
- ✅ `backend/src/services/auth.service.js` - change-password valida ownership
- ✅ `backend/src/middlewares/rateLimiter.js` - NUEVO ARCHIVO

**Frontend - Archivos Modificados:**
- ✅ `frontend/plataforma/src/components/molecules/perfil/OrdersSection.vue` - Usa API
- ✅ `frontend/plataforma/src/stores/favorites.ts` - Usa API
- ✅ `frontend/plataforma/src/components/molecules/perfil/ConfigSection.vue` - Validaciones

---

### Paso 2: Verificar Sintaxis (5 min)

**Backend - Verificar que no hay errores:**
```bash
cd backend
npm install  # Instalar dependencias (por si acaso)
node -c src/routes/auth.routes.js
node -c src/routes/admin.routes.js
node -c src/middlewares/rateLimiter.js
```

**Frontend - Verificar TypeScript:**
```bash
cd frontend/plataforma
npm run type-check
```

---

### Paso 3: Pruebas Locales (15 min)

**Test 1: Órdenes desde API**
```bash
# Terminal 1 - Backend en desarrollo
cd backend
npm run dev

# Terminal 2 - Acceder con usuario A
curl -H "Authorization: Bearer <TOKEN_A>" \
  http://localhost:4000/api/orders

# Resultado esperado: Solo órdenes de usuario A
```

**Test 2: Rate Limiting**
```bash
# Intentar 6 veces forgotten-password en 15 minutos
for i in {1..6}; do
  curl -X POST http://localhost:4000/api/auth/forgot-password \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com"}'
  echo "Intento $i"
  sleep 1
done

# Intento 4-6 debería retornar: 429 Too Many Requests
```

**Test 3: Admin Meta Protegido**
```bash
# Sin token
curl http://localhost:4000/api/admin/meta

# Resultado esperado: 401 Unauthorized

# Con token de usuario normal
curl -H "Authorization: Bearer <TOKEN_USER>" \
  http://localhost:4000/api/admin/meta

# Resultado esperado: 403 Forbidden
```

**Test 4: Favoritos desde API**
```bash
# Abrir Chrome DevTools en PerfilUserView
# Ver en Console que localStorage NO tiene 'favorites'
# Ver en Network que GET /api/favorites se ejecuta
```

---

### Paso 4: Merge a Producción (5 min)

**Opción A: Git (si usas)**
```bash
git add .
git commit -m "🔐 Security: Fix data isolation vulnerabilities

- Add JWT protection to admin/meta endpoints
- Add rate limiting to auth endpoints
- Move orders/favorites from localStorage to API
- Validate ownership in changePassword
- Add strong password validation"
git push origin main
```

**Opción B: Manual**
1. Copiar archivos Backend modificados a servidor
2. Copiar archivos Frontend modificados a servidor
3. Reiniciar backend: `npm restart`
4. Recompiliar frontend: `npm run build`

---

## ⚠️ PUNTOS CRÍTICOS

### NO OLVIDES:

1. **Reinstalar dependencias del backend**
   ```bash
   cd backend && npm install
   ```
   Razón: Nuevo archivo rateLimiter.js podría requerir módulos

2. **Verificar que JWT_SECRET existe en .env**
   ```bash
   grep JWT_SECRET backend/.env
   ```
   Si no existe:
   ```bash
   echo "JWT_SECRET=your-super-secret-key-here" >> backend/.env
   ```

3. **Limpiar localStorage en navegadores de prueba**
   ```javascript
   // En DevTools Console
   localStorage.clear()
   sessionStorage.clear()
   location.reload()
   ```

4. **No deshacer cambios de `favorites.ts`**
   - Nuevo store depende de API
   - Los cambios son compatibles hacia atrás

---

## 🔍 VALIDACIÓN POST-DEPLOYMENT

Después de desplegar, verificar:

```javascript
// En DevTools Console del navegador

// ❌ Esto NO debe existir
localStorage.getItem('orders')  // Debería ser null
localStorage.getItem('orderHistory')  // Debería ser null
localStorage.getItem('favorites')  // Debería ser null

// ✅ Esto debe existir
localStorage.getItem('token')  // JWT del usuario
localStorage.getItem('user')  // Datos del usuario

// ✅ Network Tab debe mostrar:
// GET /api/orders - las órdenes vienen de aquí
// GET /api/favorites - los favoritos vienen de aquí
```

---

## 🆘 Si Algo Sale Mal

### Error: "rateLimiter module not found"
```bash
# Solución: Reinstalar dependencias
cd backend && npm install && npm run dev
```

### Error: "429 Too Many Requests inmediatamente"
```bash
# Solución: Verificar que el clock del servidor está sincronizado
# El rate limiter depende del tiempo del servidor

# O: Borrar el caché de rate limiting (reiniciar servidor)
```

### Orders/Favorites no cargan desde API
```bash
# Verificar en Network Tab:
# 1. ¿Se envía Authorization header?
# 2. ¿La respuesta es 200 OK?
# 3. ¿El token es válido? (no expirado)

# Si token expiró:
localStorage.clear()
location.reload()
# Y vuelve a hacer login
```

### Contraseñas rechazadas en ConfigSection
```javascript
// Verificar que cumple con:
// - Mínimo 8 caracteres
// - Al menos 1 mayúscula
// - Al menos 1 minúscula
// - Al menos 1 número

// ✅ Válido: MyPassword123
// ❌ Inválido: password (no mayúscula/número)
```

---

## 📊 RESULTADOS ESPERADOS

Después del deployment deberías ver:

| Funcionalidad | ANTES | DESPUÉS |
|---|---|---|
| **Órdenes** | localStorage | API |
| **Favoritos** | localStorage | API |
| **Admin Meta** | Acceso público | Requiere JWT + admin |
| **Change Password** | Sin protección | JWT + rate limit |
| **Forgot Password** | Infinitos intentos | 3/15min |

---

## ✅ CHECKLIST FINAL

Antes de dar por completado:

- [ ] Todos los tests locales pasaron
- [ ] No hay errores en console
- [ ] Rate limiting funciona (429 después de N intentos)
- [ ] localStorage NO tiene órdenes/favoritos
- [ ] API GET /orders retorna solo órdenes del usuario
- [ ] API GET /favorites retorna solo favoritos del usuario
- [ ] Rutas admin requieren autenticación
- [ ] Cambio de contraseña requiere JWT
- [ ] Validación de contraseña fuerte funciona

---

## 📚 DOCUMENTACIÓN COMPLETA

Para más detalles técnicos, ver:
- `RESUMEN_SEGURIDAD.md` - Resumen ejecutivo
- `REPORTE_CORRECCIONES_SEGURIDAD.md` - Detalles técnicos completos

---

**Estimado de tiempo total:** 30-45 minutos desde checkout hasta validación ✅
