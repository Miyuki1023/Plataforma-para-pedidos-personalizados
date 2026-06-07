# ✅ CHECKLIST FINAL DE VALIDACIÓN

## 🧪 Tests Antes de Deployment

### 1. Backend - Sintaxis

```bash
# En terminal
cd backend

# Verificar que no hay errores de sintaxis
node -c src/routes/auth.routes.js
node -c src/routes/admin.routes.js  
node -c src/middlewares/rateLimiter.js
node -c src/controllers/auth.controller.js
node -c src/services/auth.service.js

# Resultado esperado: Sin errores
```

**Status:** ☐ Completado

---

### 2. Backend - Iniciar Servidor

```bash
npm run dev

# Resultado esperado:
# - Server running on port 4000
# - No console errors
# - Logs normales de Express
```

**Status:** ☐ Completado

---

### 3. Frontend - TypeScript

```bash
cd frontend/plataforma

npm run type-check

# Resultado esperado:
# - No TypeScript errors
# - Build successful
```

**Status:** ☐ Completado

---

### 4. Frontend - Iniciar Servidor

```bash
npm run dev

# Resultado esperado:
# - Vite running on localhost:5173
# - No console errors
# - Hot reload funciona
```

**Status:** ☐ Completado

---

## 🔐 Tests de Seguridad - Manual

### Test 1: Rate Limiting en Forgot-Password

**Procedimiento:**
```bash
# Terminal - Backend debe estar corriendo
# Ejecutar 6 veces
for i in {1..6}; do
  echo "Intento $i:"
  curl -X POST http://localhost:4000/api/auth/forgot-password \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d '{"email":"test@example.com"}' \
    -w "\nStatus: %{http_code}\n" \
    -s | jq .
  sleep 1
done
```

**Resultado Esperado:**
- Intentos 1-3: ✅ 200 OK - "Código enviado al correo"
- Intento 4-6: ❌ 429 Too Many Requests - "Demasiados intentos"

**Status:** ☐ Verificado

---

### Test 2: Admin Meta Requiere Autenticación

**Procedimiento:**
```bash
# SIN token
curl http://localhost:4000/api/admin/meta
# Resultado esperado: 401 Unauthorized

# CON token de usuario normal (rol 1)
curl -H "Authorization: Bearer <TOKEN_USER>" \
  http://localhost:4000/api/admin/meta
# Resultado esperado: 403 Forbidden

# CON token de admin (rol 3)
curl -H "Authorization: Bearer <TOKEN_ADMIN>" \
  http://localhost:4000/api/admin/meta
# Resultado esperado: 200 OK
```

**Status:** ☐ Verificado

---

### Test 3: Change-Password Requiere JWT

**Procedimiento:**
```bash
# SIN token
curl -X POST http://localhost:4000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","code":"123456","newPassword":"NewPass123"}'
# Resultado esperado: 401 Unauthorized - "Token no provisto"

# CON token válido
curl -X POST http://localhost:4000/api/auth/change-password \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","code":"123456","newPassword":"NewPass123"}'
# Resultado esperado: 400 Bad Request (código inválido) pero ACEPTA el request
```

**Status:** ☐ Verificado

---

### Test 4: Órdenes desde API (Frontend)

**Procedimiento:**
1. Abrir Chrome DevTools (F12)
2. Ir a pestaña Network
3. Navegar a PerfilUserView
4. Ver pestañas de Network

**Resultado Esperado:**
- ✅ Hay un request `GET /api/orders`
- ✅ Status 200 OK
- ✅ Response contiene array de órdenes
- ❌ NO hay `localStorage.getItem('orderHistory')`

**Status:** ☐ Verificado

---

### Test 5: Favoritos desde API (Frontend)

**Procedimiento:**
1. Abrir Chrome DevTools (F12)
2. Ir a Console y ejecutar:
```javascript
localStorage.getItem('favorites')
// Resultado esperado: null
```

3. Ir a Network Tab
4. Hacer click en un favorito
5. Ver que se hace request a `/api/favorites/:id`

**Resultado Esperado:**
- ✅ localStorage.getItem('favorites') retorna null
- ✅ Hay un request POST/DELETE a `/api/favorites/:id`
- ✅ Status 200/201 OK

**Status:** ☐ Verificado

---

### Test 6: Validación de Contraseña Fuerte (Frontend)

**Procedimiento:**
1. Navegar a PerfilUserView
2. Hacer click en "Cambiar contraseña"
3. Llegar a Step 3 (Nueva contraseña)
4. Probar diferentes contraseñas:

```
Escribir en el campo "Nueva contraseña":

"password"      → Resultado: Rojo "Necesita mayúsculas"
"Password"      → Resultado: Rojo "Necesita números"
"Password1"     → Resultado: Verde "✅ Contraseña fuerte"
"Pass12"        → Resultado: Rojo "Mínimo 8 caracteres"
```

**Resultado Esperado:**
- ✅ Indicador de fortaleza en tiempo real
- ✅ Botón deshabilitado hasta que sea fuerte
- ✅ Mensajes específicos de qué falta

**Status:** ☐ Verificado

---

### Test 7: Bloqueo tras 3 Intentos Fallidos (Frontend)

**Procedimiento:**
1. Modal de cambiar contraseña
2. Step 2 - Ingresa código incorrecto 4 veces
3. Intenta 5ª vez

**Resultado Esperado:**
- ✅ Intentos 1-3: Error "Código incorrecto"
- ✅ Intento 4: Mensaje "Demasiados intentos"
- ✅ Campo bloqueado (disabled)
- ✅ Mensaje: "Espera 5 minutos"
- ✅ Modal desbloquea automático después de 5 min

**Status:** ☐ Verificado

---

### Test 8: Datos NO en localStorage

**Procedimiento:**
1. Abrir DevTools (F12)
2. Application → Storage → Local Storage
3. Seleccionar tu dominio
4. Ver lista completa

**Resultado Esperado:**
- ✅ localStorage contiene: `token`, `user`
- ❌ localStorage NO contiene: `orders`, `orderHistory`, `favorites`

**Status:** ☐ Verificado

---

## 🚨 Tests de Casos Críticos

### Test 9: Usuario A no ve órdenes de Usuario B

**Procedimiento:**
1. Crear 2 usuarios (A y B)
2. Usuario A hace una compra → Genera orden 1
3. Usuario B hace una compra → Genera orden 2
4. Usuario A hace login
5. Navega a PerfilUserView
6. Abre DevTools → Application → XHR requests
7. Encontrar `GET /api/orders`
8. Ver response

**Resultado Esperado:**
- ✅ Usuario A ve SOLO orden 1
- ❌ Usuario A NO ve orden 2
- ✅ Response contiene solo órdenes del usuario A

**Status:** ☐ Verificado

---

### Test 10: Usuario A no ve favoritos de Usuario B

**Procedimiento:**
1. Usuario A agrega productos 1, 2, 3 a favoritos
2. Usuario B agrega productos 4, 5 a favoritos
3. Usuario A hace logout
4. Usuario A hace login nuevamente
5. Navega a PerfilUserView
6. Ver section de favoritos

**Resultado Esperado:**
- ✅ Usuario A ve SOLO productos 1, 2, 3
- ❌ Usuario A NO ve productos 4, 5
- ✅ Los favoritos NO vienen de localStorage

**Status:** ☐ Verificado

---

## 📊 Resumen Visual

| Test | Categoría | Estado |
|------|-----------|--------|
| 1. Sintaxis Backend | Básico | ☐ |
| 2. Iniciar Backend | Básico | ☐ |
| 3. TypeScript Frontend | Básico | ☐ |
| 4. Iniciar Frontend | Básico | ☐ |
| 5. Rate Limiting | Seguridad | ☐ |
| 6. Admin Meta Auth | Seguridad | ☐ |
| 7. Change-Password JWT | Seguridad | ☐ |
| 8. Órdenes API | Frontend | ☐ |
| 9. Favoritos API | Frontend | ☐ |
| 10. Validación Password | Frontend | ☐ |
| 11. localStorage Limpio | Frontend | ☐ |
| 12. Bloqueo Intentos | Frontend | ☐ |
| 13. Órdenes Aisladas | Crítico | ☐ |
| 14. Favoritos Aislados | Crítico | ☐ |

---

## 🎯 Si TODO está ✅

Completaste la implementación exitosamente. Puedes:

1. ✅ Mergear cambios a rama principal
2. ✅ Deployar a producción
3. ✅ Notificar al equipo que está completo
4. ✅ Documentar en Jira/GitHub Issues

---

## ⚠️ Si algo está ❌

1. Revisa los documentos:
   - `RESUMEN_SEGURIDAD.md` - resumen ejecutivo
   - `REPORTE_CORRECCIONES_SEGURIDAD.md` - detalles técnicos
   - `GUIA_DEPLOYMENT.md` - paso a paso

2. Verifica logs del servidor:
   ```bash
   npm run dev 2>&1 | tee server.log
   ```

3. Busca errores en console del navegador (DevTools F12)

4. Prueba conexión a API:
   ```bash
   curl http://localhost:4000/api/health
   ```

---

**Checklist completado:** ☐ Todo validado y listo para producción
