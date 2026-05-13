================================================================================
         DOCUMENTACIÓN COMPLETA DE RUTAS - API REST
================================================================================

BASE URLs:
  - Autenticación: http://localhost:3000/api/auth
  - Usuarios: http://localhost:3000/api/users
  - Productos: http://localhost:3000/api/products
  - Carrito: http://localhost:3000/api/cart
  - Direcciones: http://localhost:3000/api/addresses
  - Admin: http://localhost:3000/api/admin

================================================================================
                        RUTAS DE AUTENTICACIÓN
================================================================================

19. REGISTRAR NUEVO USUARIO
────────────────────────────────────────────────────────────────────────────
   Método: POST
   URL: /api/auth/register
   Autenticación: NO requerida
   
   Descripción: Crea una nueva cuenta de usuario
   
   Headers Requeridos:
   Content-Type: application/json
   
   Body (JSON):
   {
     "usuario": "usuario123",           (string, REQUERIDO - único)
     "email": "user@example.com",       (string, REQUERIDO - válido)
     "password": "Password123!",        (string, REQUERIDO - mín 8 caracteres)
     "fecha_nacimiento": "1995-05-15",  (date, REQUERIDO)
     "sexo": "M"                        (string, REQUERIDO - "M" o "F")
   }
   
   Respuesta Exitosa (201):
   {
     "message": "Usuario registrado exitosamente",
     "user": {
       "id": 5,
       "usuario": "usuario123",
       "email": "user@example.com",
       "rol": 1
     }
   }
   
   Error (400 - Campo inválido):
   { "message": "El email debe ser válido" }
   { "message": "El usuario ya existe" }
   { "message": "La contraseña debe tener al menos 8 caracteres" }
   
   Ejemplo en Frontend (JavaScript):
   const datos = {
     usuario: "juanperez",
     email: "juan@example.com",
     password: "Secure123!",
     fecha_nacimiento: "1990-03-20",
     sexo: "M"
   };
   
   fetch('http://localhost:3000/api/auth/register', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(datos)
   })
     .then(res => res.json())
     .then(data => console.log(data.user))


2. INICIAR SESIÓN
────────────────────────────────────────────────────────────────────────────
   Método: POST
   URL: /api/auth/login
   Autenticación: NO requerida
   
   Descripción: Autentica un usuario y devuelve un token
   
   Headers Requeridos:
   Content-Type: application/json
   
   Body (JSON):
   {
     "usuario": "usuario123",     (string, REQUERIDO)
     "password": "Password123!"   (string, REQUERIDO)
   }
   
   Respuesta Exitosa (200):
   {
     "message": "Sesión iniciada exitosamente",
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": 1,
       "usuario": "usuario123",
       "email": "user@example.com",
       "rol": 1
     }
   }
   
   Error (401):
   { "message": "Usuario o contraseña incorrectos" }
   
   Ejemplo en Frontend (JavaScript):
   const credenciales = {
     usuario: "juanperez",
     password: "Secure123!"
   };
   
   fetch('http://localhost:3000/api/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(credenciales)
   })
     .then(res => res.json())
     .then(data => {
       localStorage.setItem('token', data.token);
       console.log(data.user);
     })


3. CERRAR SESIÓN
────────────────────────────────────────────────────────────────────────────
   Método: POST
   URL: /api/auth/logout
   Autenticación: SÍ requerida (token en header)
   
   Descripción: Cierra la sesión del usuario
   
   Headers Requeridos:
   Authorization: Bearer <token>
   
   Body: {}
   
   Respuesta Exitosa (200):
   { "message": "Sesión cerrada exitosamente" }
   
   Ejemplo en Frontend (JavaScript):
   const token = localStorage.getItem('token');
   
   fetch('http://localhost:3000/api/auth/logout', {
     method: 'POST',
     headers: { 
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({})
   })
     .then(res => res.json())
     .then(data => {
       localStorage.removeItem('token');
       console.log(data.message);
     })


4. REGISTRAR NUEVO ADMIN (solo admin existente)
────────────────────────────────────────────────────────────────────────────
   Método: POST
   URL: /api/auth/admin/register
   Autenticación: SÍ requerida (solo admin)
   
   Descripción: Crea una nueva cuenta de administrador (solo otro admin puede hacerlo)
   
   Headers Requeridos:
   Authorization: Bearer <token_admin>
   Content-Type: application/json
   
   Body (JSON):
   {
     "usuario": "admin2",
     "email": "admin2@example.com",
     "password": "AdminPass123!",
     "fecha_nacimiento": "1990-01-01",
     "sexo": "F"
   }
   
   Respuesta Exitosa (201):
   {
     "message": "Admin registrado exitosamente",
     "user": {
       "id": 6,
       "usuario": "admin2",
       "email": "admin2@example.com",
       "rol": 3
     }
   }
   
   Error (403):
   { "message": "Acceso denegado: se requieren permisos de administrador" }


================================================================================
                        RUTAS DE USUARIOS
================================================================================

5. OBTENER PERFIL DE USUARIO
────────────────────────────────────────────────────────────────────────────
   Método: GET
   URL: /api/users/profile
   Autenticación: SÍ requerida (token en header)
   
   Descripción: Obtiene la información del perfil del usuario autenticado
   
   Headers Requeridos:
   Authorization: Bearer <token>
   
   Respuesta Exitosa (200):
   {
     "id": 1,
     "usuario": "juanperez",
     "email": "juan@example.com",
     "fecha_nacimiento": "1990-03-20",
     "sexo": "M",
     "telefono": "987654321",
     "rol": 1,
     "activo": true,
     "fecha_registro": "2024-01-15"
   }
   
   Error (401):
   { "message": "Token inválido o expirado" }
   
   Ejemplo en Frontend (JavaScript):
   const token = localStorage.getItem('token');
   
   fetch('http://localhost:3000/api/users/profile', {
     headers: { 'Authorization': `Bearer ${token}` }
   })
     .then(res => res.json())
     .then(profile => console.log(profile))


6. ACTUALIZAR PERFIL DE USUARIO
────────────────────────────────────────────────────────────────────────────
   Método: PUT
   URL: /api/users/profile
   Autenticación: SÍ requerida (token en header)
   
   Descripción: Actualiza información del perfil (TODOS LOS CAMPOS OPCIONALES)
   
   Headers Requeridos:
   Authorization: Bearer <token>
   Content-Type: application/json
   
   Body (JSON):
   {
     "telefono": "987654321",           (string, OPCIONAL)
     "fecha_nacimiento": "1995-05-15",  (date, OPCIONAL)
     "sexo": "F"                        (string, OPCIONAL)
   }
   
   Respuesta Exitosa (200):
   {
     "message": "Perfil actualizado exitosamente",
     "user": {
       "id": 1,
       "usuario": "juanperez",
       "email": "juan@example.com",
       "telefono": "987654321",
       "fecha_nacimiento": "1995-05-15",
       "sexo": "F"
     }
   }
   
   Ejemplo en Frontend (JavaScript):
   const token = localStorage.getItem('token');
   
   fetch('http://localhost:3000/api/users/profile', {
     method: 'PUT',
     headers: { 
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({ telefono: "999888777" })
   })
     .then(res => res.json())
     .then(data => console.log(data.user))


================================================================================
                        RUTAS DE DIRECCIÓN
================================================================================

7. OBTENER TODOS LOS DISTRITOS (público)
────────────────────────────────────────────────────────────────────────────
   Método: GET
   URL: /api/addresses/districts
   Autenticación: NO requerida
   
   Descripción: Obtiene la lista de distritos para formularios
   
   Respuesta Exitosa (200):
   [
     { "id": 1, "nombre": "Lima" },
     { "id": 2, "nombre": "Callao" },
     { "id": 3, "nombre": "San Isidro" },
     ...
   ]
   
   Ejemplo en Frontend (JavaScript):
   fetch('http://localhost:3000/api/addresses/districts')
     .then(res => res.json())
     .then(distritos => console.log(distritos))


8. OBTENER DIRECCIONES DEL USUARIO
────────────────────────────────────────────────────────────────────────────
   Método: GET
   URL: /api/addresses
   Autenticación: SÍ requerida (token en header)
   
   Descripción: Obtiene todas las direcciones guardadas del usuario
   
   Headers Requeridos:
   Authorization: Bearer <token>
   
   Respuesta Exitosa (200):
   [
     {
       "id": 1,
       "usuario_id": 1,
       "calle": "Av. Principal 123",
       "numero": "123",
       "referencia": "Cerca al parque",
       "distrito_id": 1,
       "nombre_direccion": "Casa"
     },
     {
       "id": 2,
       "usuario_id": 1,
       "calle": "Jr. Secundaria 456",
       "numero": "456",
       "referencia": "Frente a la tienda",
       "distrito_id": 2,
       "nombre_direccion": "Oficina"
     }
   ]
   
   Ejemplo en Frontend (JavaScript):
   const token = localStorage.getItem('token');
   
   fetch('http://localhost:3000/api/addresses', {
     headers: { 'Authorization': `Bearer ${token}` }
   })
     .then(res => res.json())
     .then(direcciones => console.log(direcciones))


9. OBTENER DIRECCIÓN ESPECÍFICA
────────────────────────────────────────────────────────────────────────────
   Método: GET
   URL: /api/addresses/:id
   Autenticación: SÍ requerida (token en header)
   
   Descripción: Obtiene una dirección específica por su ID
   
   Headers Requeridos:
   Authorization: Bearer <token>
   
   Parámetros:
   - id (número): ID de la dirección
   
   Respuesta Exitosa (200):
   {
     "id": 1,
     "usuario_id": 1,
     "calle": "Av. Principal 123",
     "numero": "123",
     "referencia": "Cerca al parque",
     "distrito_id": 1,
     "nombre_direccion": "Casa"
   }
   
   Error (404):
   { "message": "Dirección no encontrada" }


10. CREAR NUEVA DIRECCIÓN
────────────────────────────────────────────────────────────────────────────
   Método: POST
   URL: /api/addresses
   Autenticación: SÍ requerida (token en header)
   
   Descripción: Crea una nueva dirección para el usuario
   
   Headers Requeridos:
   Authorization: Bearer <token>
   Content-Type: application/json
   
   Body (JSON):
   {
     "calle": "Av. Principal",          (string, REQUERIDO)
     "numero": "123",                   (string, REQUERIDO)
     "referencia": "Cerca al parque",   (string, OPCIONAL)
     "distrito_id": 1,                  (número, REQUERIDO)
     "nombre_direccion": "Casa"         (string, OPCIONAL)
   }
   
   Respuesta Exitosa (201):
   {
     "message": "Dirección creada exitosamente",
     "address": {
       "id": 3,
       "usuario_id": 1,
       "calle": "Av. Principal",
       "numero": "123",
       "referencia": "Cerca al parque",
       "distrito_id": 1,
       "nombre_direccion": "Casa"
     }
   }
   
   Error (400):
   { "message": "Los campos calle, numero y distrito_id son requeridos" }


11. ACTUALIZAR DIRECCIÓN
────────────────────────────────────────────────────────────────────────────
   Método: PUT
   URL: /api/addresses/:id
   Autenticación: SÍ requerida (token en header)
   
   Descripción: Actualiza una dirección existente
   
   Headers Requeridos:
   Authorization: Bearer <token>
   Content-Type: application/json
   
   Parámetros:
   - id (número): ID de la dirección
   
   Body (JSON) - TODOS OPCIONALES:
   {
     "calle": "Av. Nueva",
     "numero": "456",
     "referencia": "Nuevo punto de referencia",
     "distrito_id": 2,
     "nombre_direccion": "Oficina"
   }
   
   Respuesta Exitosa (200):
   {
     "message": "Dirección actualizada exitosamente",
     "address": { ...datos actualizados... }
   }


12. ELIMINAR DIRECCIÓN
────────────────────────────────────────────────────────────────────────────
   Método: DELETE
   URL: /api/addresses/:id
   Autenticación: SÍ requerida (token en header)
   
   Descripción: Elimina una dirección del usuario
   
   Headers Requeridos:
   Authorization: Bearer <token>
   
   Parámetros:
   - id (número): ID de la dirección
   
   Respuesta Exitosa (200):
   {
     "message": "Dirección eliminada exitosamente",
     "address": { ...datos eliminados... }
   }


================================================================================
                        RUTAS DE CARRITO
================================================================================

13. CREAR CARRITO (si no existe)
────────────────────────────────────────────────────────────────────────────
   Método: POST
   URL: /api/cart
   Autenticación: SÍ requerida (token en header)
   
   Descripción: Crea un carrito para el usuario si no existe uno
   
   Headers Requeridos:
   Authorization: Bearer <token>
   Content-Type: application/json
   
   Body: {}
   
   Respuesta Exitosa (201):
   {
     "message": "Carrito creado",
     "cart": {
       "id": 1,
       "usuario_id": 1,
       "total": 0,
       "items": []
     }
   }


14. OBTENER CARRITO DEL USUARIO
────────────────────────────────────────────────────────────────────────────
   Método: GET
   URL: /api/cart
   Autenticación: SÍ requerida (token en header)
   
   Descripción: Obtiene el carrito actual del usuario con todos sus items
   
   Headers Requeridos:
   Authorization: Bearer <token>
   
   Respuesta Exitosa (200):
   {
     "id": 1,
     "usuario_id": 1,
     "total": 299.97,
     "items": [
       {
         "id": 1,
         "carrito_id": 1,
         "producto_id": 1,
         "nombre": "Tablet",
         "precio": 99.99,
         "cantidad": 2,
         "opciones": [
           {
             "nombre": "Color Azul",
             "precio_adicional": 5.00
           }
         ],
         "subtotal": 209.98
       }
     ]
   }
   
   Ejemplo en Frontend (JavaScript):
   const token = localStorage.getItem('token');
   
   fetch('http://localhost:3000/api/cart', {
     headers: { 'Authorization': `Bearer ${token}` }
   })
     .then(res => res.json())
     .then(cart => console.log(`Total: $${cart.total}`))


15. AGREGAR ITEM AL CARRITO
────────────────────────────────────────────────────────────────────────────
   Método: POST
   URL: /api/cart/items
   Autenticación: SÍ requerida (token en header)
   
   Descripción: Agrega un producto al carrito (con opciones si desea)
   
   Headers Requeridos:
   Authorization: Bearer <token>
   Content-Type: application/json
   
   Body (JSON):
   {
     "producto_id": 1,              (número, REQUERIDO)
     "cantidad": 2,                 (número, REQUERIDO - mín 1)
     "opciones": [                  (array, OPCIONAL)
       {
         "id": 1,
         "nombre": "Color Rojo",
         "precio_adicional": 5.99
       }
     ]
   }
   
   Respuesta Exitosa (201):
   {
     "message": "Producto agregado al carrito",
     "item": {
       "id": 5,
       "carrito_id": 1,
       "producto_id": 1,
       "nombre": "Tablet",
       "precio": 99.99,
       "cantidad": 2,
       "opciones": [...],
       "subtotal": 209.98
     }
   }
   
   Ejemplo en Frontend (JavaScript):
   const token = localStorage.getItem('token');
   
   const nuevoItem = {
     producto_id: 1,
     cantidad: 2,
     opciones: [
       { id: 1, nombre: "Color Azul", precio_adicional: 5.99 }
     ]
   };
   
   fetch('http://localhost:3000/api/cart/items', {
     method: 'POST',
     headers: { 
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify(nuevoItem)
   })
     .then(res => res.json())
     .then(data => console.log(data.item))


16. ACTUALIZAR ITEM DEL CARRITO
────────────────────────────────────────────────────────────────────────────
   Método: PUT
   URL: /api/cart/items/:itemId
   Autenticación: SÍ requerida (token en header)
   
   Descripción: Actualiza cantidad u opciones de un item
   
   Headers Requeridos:
   Authorization: Bearer <token>
   Content-Type: application/json
   
   Parámetros:
   - itemId (número): ID del item en el carrito
   
   Body (JSON):
   {
     "cantidad": 3,                 (número, OPCIONAL)
     "opciones": [                  (array, OPCIONAL)
       {
         "id": 2,
         "nombre": "Tamaño Grande",
         "precio_adicional": 10.00
       }
     ]
   }
   
   Respuesta Exitosa (200):
   {
     "message": "Item actualizado",
     "item": { ...datos actualizados... }
   }


17. REMOVER ITEM DEL CARRITO
────────────────────────────────────────────────────────────────────────────
   Método: DELETE
   URL: /api/cart/items/:itemId
   Autenticación: SÍ requerida (token en header)
   
   Descripción: Elimina un item del carrito
   
   Headers Requeridos:
   Authorization: Bearer <token>
   
   Parámetros:
   - itemId (número): ID del item a remover
   
   Respuesta Exitosa (200):
   {
     "message": "Item removido del carrito",
     "cart": { ...carrito actualizado... }
   }
   
   Ejemplo en Frontend (JavaScript):
   const token = localStorage.getItem('token');
   
   fetch('http://localhost:3000/api/cart/items/5', {
     method: 'DELETE',
     headers: { 'Authorization': `Bearer ${token}` }
   })
     .then(res => res.json())
     .then(data => console.log(data.message))


18. SINCRONIZAR CARRITO
────────────────────────────────────────────────────────────────────────────
   Método: POST
   URL: /api/cart/sync
   Autenticación: SÍ requerida (token en header)
   
   Descripción: Sincroniza carrito local con el servidor (fusiona items)
   
   Headers Requeridos:
   Authorization: Bearer <token>
   Content-Type: application/json
   
   Body (JSON):
   {
     "items": [                     (array, REQUERIDO)
       {
         "producto_id": 1,
         "cantidad": 2,
         "opciones": [...]
       }
     ]
   }
   
   Respuesta Exitosa (200):
   {
     "message": "Carrito sincronizado",
     "cart": { ...carrito del servidor... }
   }


================================================================================
                        RUTAS DE PRODUCTOS Y OPCIONES
================================================================================

1. OBTENER TODOS LOS PRODUCTOS
────────────────────────────────────────────────────────────────────────────
   Método: GET
   URL: /api/products
   Autenticación: NO requerida
   
   Descripción: Obtiene todos los productos disponibles
   
   Parámetros: Ninguno
   
   Respuesta Exitosa (200):
   [
     {
       "id": 1,
       "nombre": "Producto 1",
       "precio": 99.99,
       "categoria": "Electrónica",
       "disponible": true,
       "imagen_url": ["url1.jpg", "url2.jpg"],
       "stock": 10,
       "descripcion": "Descripción del producto"
     },
     ...
   ]
   
   Ejemplo en Frontend (JavaScript):
   fetch('http://localhost:3000/api/products')
     .then(res => res.json())
     .then(data => console.log(data))


20. OBTENER UN PRODUCTO ESPECÍFICO (CON OPCIONES)
────────────────────────────────────────────────────────────────────────────
   Método: GET
   URL: /api/products/:id
   Autenticación: NO requerida
   
   Descripción: Obtiene un producto con todas sus opciones de personalización
   
   Parámetros:
   - id (número): ID del producto
   
   Respuesta Exitosa (200):
   {
     "id": 1,
     "nombre": "Producto 1",
     "precio": 99.99,
     "categoria": "Electrónica",
     "disponible": true,
     "imagen_url": ["url1.jpg", "url2.jpg", "url3.jpg"],
     "stock": 10,
     "descripcion": "Descripción del producto",
     "opciones": [
       {
         "id": 1,
         "id_producto": 1,
         "nombre": "Color Rojo",
         "precio_adicional": 5.99
       },
       {
         "id": 2,
         "id_producto": 1,
         "nombre": "Tamaño Grande",
         "precio_adicional": 3.50
       }
     ]
   }
   
   Error (404):
   { "message": "Producto no encontrado" }
   
   Ejemplo en Frontend (JavaScript):
   fetch('http://localhost:3000/api/products/1')
     .then(res => res.json())
     .then(product => console.log(product.opciones))


21. CREAR UN NUEVO PRODUCTO
────────────────────────────────────────────────────────────────────────────
   Método: POST
   URL: /api/products
   Autenticación: SÍ (requiere token de admin) - TODO: implementar
   
   Descripción: Crea un nuevo producto
   
   Headers Requeridos:
   Content-Type: application/json
   
   Body (JSON):
   {
     "nombre": "Nuevo Producto",          (string, REQUERIDO)
     "precio": 59.99,                      (número, REQUERIDO)
     "categoria": "Electrónica",           (string, REQUERIDO)
     "stock": 15,                          (número, REQUERIDO)
     "descripcion": "Descripción...",      (string, OPCIONAL)
     "imagenUrls": [                       (array, OPCIONAL - máx 3 URLs)
       "https://ejemplo.com/img1.jpg",
       "https://ejemplo.com/img2.jpg"
     ]
   }
   
   Respuesta Exitosa (201):
   {
     "message": "Producto creado exitosamente",
     "product": {
       "id": 5,
       "nombre": "Nuevo Producto",
       "precio": 59.99,
       "categoria": "Electrónica",
       "disponible": true,
       "imagen_url": ["https://ejemplo.com/img1.jpg", "https://ejemplo.com/img2.jpg"],
       "stock": 15,
       "descripcion": "Descripción..."
     }
   }
   
   Error (400 - Campo faltante):
   { "message": "Los campos nombre, precio, categoria y stock son requeridos" }
   
   Error (400 - Más de 3 imágenes):
   { "message": "Se permite un máximo de 3 URLs de imagen" }
   
   Ejemplo en Frontend (JavaScript):
   const nuevoProducto = {
     nombre: "Tablet Samsung",
     precio: 399.99,
     categoria: "Electrónica",
     stock: 20,
     descripcion: "Tablet de última generación",
     imagenUrls: ["img1.jpg", "img2.jpg"]
   };
   
   fetch('http://localhost:3000/api/products', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(nuevoProducto)
   })
     .then(res => res.json())
     .then(data => console.log(data.product))


22. ACTUALIZAR UN PRODUCTO
────────────────────────────────────────────────────────────────────────────
   Método: PUT
   URL: /api/products/:id
   Autenticación: SÍ (requiere token de admin) - TODO: implementar
   
   Descripción: Actualiza los datos de un producto existente
   
   Parámetros:
   - id (número): ID del producto a actualizar
   
   Headers Requeridos:
   Content-Type: application/json
   
   Body (JSON) - TODOS LOS CAMPOS SON OPCIONALES:
   {
     "nombre": "Nuevo nombre",
     "precio": 79.99,
     "categoria": "Nueva categoría",
     "stock": 25,
     "descripcion": "Nueva descripción",
     "imagenUrls": ["nueva1.jpg", "nueva2.jpg"],
     "disponible": false
   }
   
   Respuesta Exitosa (200):
   {
     "message": "Producto actualizado exitosamente",
     "product": {
       "id": 1,
       "nombre": "Nuevo nombre",
       "precio": 79.99,
       "categoria": "Nueva categoría",
       "disponible": false,
       "imagen_url": ["nueva1.jpg", "nueva2.jpg"],
       "stock": 25,
       "descripcion": "Nueva descripción"
     }
   }
   
   Error (404):
   { "message": "Producto no encontrado" }
   
   Ejemplo en Frontend (JavaScript):
   const actualizacion = {
     precio: 149.99,
     stock: 5
   };
   
   fetch('http://localhost:3000/api/products/1', {
     method: 'PUT',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(actualizacion)
   })
     .then(res => res.json())
     .then(data => console.log(data.product))


23. ELIMINAR UN PRODUCTO
────────────────────────────────────────────────────────────────────────────
   Método: DELETE
   URL: /api/products/:id
   Autenticación: SÍ (requiere token de admin) - TODO: implementar
   
   Descripción: Elimina un producto
   
   Parámetros:
   - id (número): ID del producto a eliminar
   
   Respuesta Exitosa (200):
   {
     "message": "Producto eliminado exitosamente",
     "product": {
       "id": 1,
       "nombre": "Producto Eliminado"
     }
   }
   
   Error (404):
   { "message": "Producto no encontrado" }
   
   Ejemplo en Frontend (JavaScript):
   fetch('http://localhost:3000/api/products/1', {
     method: 'DELETE'
   })
     .then(res => res.json())
     .then(data => console.log(data.message))


================================================================================
              RUTAS DE OPCIONES DE PERSONALIZACIÓN (ESPECIFICACIONES)
================================================================================

24. OBTENER OPCIONES DE UN PRODUCTO
────────────────────────────────────────────────────────────────────────────
   Método: GET
   URL: /api/products/:id/options
   Autenticación: NO requerida
   
   Descripción: Obtiene todas las opciones de personalización de un producto
   
   Parámetros:
   - id (número): ID del producto
   
   Respuesta Exitosa (200):
   [
     {
       "id": 1,
       "id_producto": 1,
       "nombre": "Color Rojo",
       "precio_adicional": 5.99
     },
     {
       "id": 2,
       "id_producto": 1,
       "nombre": "Tamaño Grande",
       "precio_adicional": 3.50
     }
   ]
   
   Ejemplo en Frontend (JavaScript):
   fetch('http://localhost:3000/api/products/1/options')
     .then(res => res.json())
     .then(opciones => console.log(opciones))


25. CREAR UNA OPCIÓN DE PERSONALIZACIÓN
────────────────────────────────────────────────────────────────────────────
   Método: POST
   URL: /api/products/:id/options
   Autenticación: SÍ (requiere token de admin) - TODO: implementar
   
   Descripción: Agrega una nueva opción de personalización a un producto
   
   Parámetros:
   - id (número): ID del producto
   
   Headers Requeridos:
   Content-Type: application/json
   
   Body (JSON):
   {
     "nombre": "Color Azul",              (string, REQUERIDO)
     "precio_adicional": 7.99            (número, REQUERIDO)
   }
   
   Respuesta Exitosa (201):
   {
     "message": "Opción de personalización creada exitosamente",
     "option": {
       "id": 3,
       "id_producto": 1,
       "nombre": "Color Azul",
       "precio_adicional": 7.99
     }
   }
   
   Error (404):
   { "message": "Producto no encontrado" }
   
   Error (400):
   { "message": "El nombre de la opción es requerido" }
   { "message": "El precio adicional es requerido" }
   
   Ejemplo en Frontend (JavaScript):
   const nuevaOpcion = {
     nombre: "Garantía Extendida",
     precio_adicional: 15.00
   };
   
   fetch('http://localhost:3000/api/products/1/options', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(nuevaOpcion)
   })
     .then(res => res.json())
     .then(data => console.log(data.option))


26. ACTUALIZAR UNA OPCIÓN DE PERSONALIZACIÓN
────────────────────────────────────────────────────────────────────────────
   Método: PUT
   URL: /api/products/:id/options/:optionId
   Autenticación: SÍ (requiere token de admin) - TODO: implementar
   
   Descripción: Actualiza una opción de personalización existente
   
   Parámetros:
   - id (número): ID del producto
   - optionId (número): ID de la opción
   
   Headers Requeridos:
   Content-Type: application/json
   
   Body (JSON):
   {
     "nombre": "Color Verde",
     "precio_adicional": 6.50
   }
   
   Respuesta Exitosa (200):
   {
     "message": "Opción de personalización actualizada exitosamente",
     "option": {
       "id": 1,
       "id_producto": 1,
       "nombre": "Color Verde",
       "precio_adicional": 6.50
     }
   }
   
   Error (404):
   { "message": "Opción de producto no encontrada" }
   
   Ejemplo en Frontend (JavaScript):
   const actualizacion = {
     nombre: "Color Negro",
     precio_adicional: 8.99
   };
   
   fetch('http://localhost:3000/api/products/1/options/1', {
     method: 'PUT',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(actualizacion)
   })
     .then(res => res.json())
     .then(data => console.log(data.option))


27. ELIMINAR UNA OPCIÓN DE PERSONALIZACIÓN
────────────────────────────────────────────────────────────────────────────
   Método: DELETE
   URL: /api/products/:id/options/:optionId
   Autenticación: SÍ (requiere token de admin) - TODO: implementar
   
   Descripción: Elimina una opción de personalización
   
   Parámetros:
   - id (número): ID del producto
   - optionId (número): ID de la opción a eliminar
   
   Respuesta Exitosa (200):
   {
     "message": "Opción de personalización eliminada exitosamente",
     "option": {
       "id": 1,
       "id_producto": 1,
       "nombre": "Color Rojo"
     }
   }
   
   Error (404):
   { "message": "Opción de producto no encontrada" }
   
   Ejemplo en Frontend (JavaScript):
   fetch('http://localhost:3000/api/products/1/options/1', {
     method: 'DELETE'
   })
     .then(res => res.json())
     .then(data => console.log(data.message))


================================================================================
                        RUTAS DE ADMINISTRACIÓN
================================================================================

28. OBTENER TODOS LOS USUARIOS (solo admin)
────────────────────────────────────────────────────────────────────────────
   Método: GET
   URL: /api/admin/users
   Autenticación: SÍ requerida (token de admin)
   
   Descripción: Obtiene la lista de todos los usuarios del sistema
   
   Headers Requeridos:
   Authorization: Bearer <token_admin>
   
   Respuesta Exitosa (200):
   {
     "users": [
       {
         "id": 1,
         "usuario": "juanperez",
         "email": "juan@example.com",
         "fecha_nacimiento": "1990-03-20",
         "sexo": "M",
         "telefono": "987654321",
         "rol": 1,
         "activo": true,
         "fecha_registro": "2024-01-15"
       },
       {
         "id": 2,
         "usuario": "marialopez",
         "email": "maria@example.com",
         "fecha_nacimiento": "1995-07-10",
         "sexo": "F",
         "telefono": "998765432",
         "rol": 2,
         "activo": true,
         "fecha_registro": "2024-02-20"
       }
     ]
   }
   
   Error (403):
   { "message": "Acceso denegado: se requieren permisos de administrador" }
   
   Ejemplo en Frontend (JavaScript):
   const tokenAdmin = localStorage.getItem('token');
   
   fetch('http://localhost:3000/api/admin/users', {
     headers: { 'Authorization': `Bearer ${tokenAdmin}` }
   })
     .then(res => res.json())
     .then(data => console.log(data.users))


29. OBTENER USUARIO ESPECÍFICO (solo admin)
────────────────────────────────────────────────────────────────────────────
   Método: GET
   URL: /api/admin/users/:id
   Autenticación: SÍ requerida (token de admin)
   
   Descripción: Obtiene información detallada de un usuario específico
   
   Headers Requeridos:
   Authorization: Bearer <token_admin>
   
   Parámetros:
   - id (número): ID del usuario
   
   Respuesta Exitosa (200):
   {
     "user": {
       "id": 1,
       "usuario": "juanperez",
       "email": "juan@example.com",
       "fecha_nacimiento": "1990-03-20",
       "sexo": "M",
       "telefono": "987654321",
       "rol": 1,
       "activo": true,
       "fecha_registro": "2024-01-15"
     }
   }
   
   Error (404):
   { "message": "Usuario no encontrado" }


30. ACTUALIZAR ROL DE USUARIO (solo admin)
────────────────────────────────────────────────────────────────────────────
   Método: PUT
   URL: /api/admin/users/:id/role
   Autenticación: SÍ requerida (token de admin)
   
   Descripción: Cambia el rol de un usuario (usuario, trabajador, admin)
   
   Headers Requeridos:
   Authorization: Bearer <token_admin>
   Content-Type: application/json
   
   Parámetros:
   - id (número): ID del usuario
   
   Body (JSON):
   {
     "rol": 2                    (número, REQUERIDO)
   }
   
   Roles válidos:
   - 1 = Usuario normal
   - 2 = Trabajador/Vendedor
   - 3 = Administrador
   
   Respuesta Exitosa (200):
   {
     "message": "Rol de usuario juanperez cambiado de 1 a 2",
     "user": {
       "id": 1,
       "usuario": "juanperez",
       "email": "juan@example.com",
       "rol": 2
     },
     "changes": {
       "previousRole": 1,
       "newRole": 2
     }
   }
   
   Error (403):
   { "message": "No puedes cambiar tu propio rol de administrador" }
   
   Ejemplo en Frontend (JavaScript):
   const tokenAdmin = localStorage.getItem('token');
   
   fetch('http://localhost:3000/api/admin/users/1/role', {
     method: 'PUT',
     headers: { 
       'Authorization': `Bearer ${tokenAdmin}`,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({ rol: 2 })
   })
     .then(res => res.json())
     .then(data => console.log(data.message))


31. ACTIVAR USUARIO (solo admin)
────────────────────────────────────────────────────────────────────────────
   Método: PUT
   URL: /api/admin/users/:id/activate
   Autenticación: SÍ requerida (token de admin)
   
   Descripción: Activa una cuenta de usuario desactivada
   
   Headers Requeridos:
   Authorization: Bearer <token_admin>
   Content-Type: application/json
   
   Parámetros:
   - id (número): ID del usuario a activar
   
   Body: {}
   
   Respuesta Exitosa (200):
   {
     "message": "Usuario juanperez ha sido activado",
     "user": {
       "id": 1,
       "usuario": "juanperez",
       "email": "juan@example.com",
       "activo": true
     },
     "changes": {
       "previousStatus": false,
       "newStatus": true
     }
   }


32. DESACTIVAR USUARIO (solo admin)
────────────────────────────────────────────────────────────────────────────
   Método: PUT
   URL: /api/admin/users/:id/deactivate
   Autenticación: SÍ requerida (token de admin)
   
   Descripción: Desactiva una cuenta de usuario (no elimina datos)
   
   Headers Requeridos:
   Authorization: Bearer <token_admin>
   Content-Type: application/json
   
   Parámetros:
   - id (número): ID del usuario a desactivar
   
   Body: {}
   
   Respuesta Exitosa (200):
   {
     "message": "Usuario juanperez ha sido desactivado",
     "user": {
       "id": 1,
       "usuario": "juanperez",
       "email": "juan@example.com",
       "activo": false
     },
     "changes": {
       "previousStatus": true,
       "newStatus": false
     }
   }
   
   Error (403):
   { "message": "No puedes desactivar tu propia cuenta" }


================================================================================
                            NOTAS IMPORTANTES
================================================================================

AUTENTICACIÓN Y TOKENS:
- Los tokens JWT se obtienen al hacer login
- Guardar el token en localStorage: localStorage.setItem('token', token)
- Incluir token en todas las rutas protegidas:
  Headers: { 'Authorization': `Bearer ${token}` }
- Los tokens tienen expiración (ver .env)
- Si expira, el usuario debe volver a hacer login

ROLES DE USUARIO:
- 1 = Usuario normal: Puede comprar, ver productos, gestionar su perfil
- 2 = Trabajador: Puede crear/editar productos y opciones (en desarrollo)
- 3 = Admin: Acceso total a gestión de usuarios y productos

RUTAS PROTEGIDAS:
- GET /api/users/profile - Requiere token cualquier usuario
- PUT /api/users/profile - Requiere token cualquier usuario
- GET /api/addresses - Requiere token
- POST /api/addresses - Requiere token
- PUT /api/addresses/:id - Requiere token
- DELETE /api/addresses/:id - Requiere token
- GET /api/cart - Requiere token
- POST /api/cart/items - Requiere token
- PUT /api/cart/items/:itemId - Requiere token
- DELETE /api/cart/items/:itemId - Requiere token
- POST /api/cart/sync - Requiere token
- GET /api/admin/* - Requiere token de admin (rol 3)
- POST /api/products - Requiere token de admin (en desarrollo)
- PUT /api/products/:id - Requiere token de admin (en desarrollo)
- DELETE /api/products/:id - Requiere token de admin (en desarrollo)
- POST /api/products/:id/options - Requiere token de admin (en desarrollo)
- PUT /api/products/:id/options/:optionId - Requiere token de admin (en desarrollo)
- DELETE /api/products/:id/options/:optionId - Requiere token de admin (en desarrollo)

RUTAS PÚBLICAS (sin autenticación):
- GET /api/products - Ver todos los productos
- GET /api/products/:id - Ver detalles de un producto
- GET /api/products/:id/options - Ver opciones de un producto
- GET /api/addresses/districts - Ver distritos disponibles
- POST /api/auth/register - Registrarse
- POST /api/auth/login - Iniciar sesión

IMÁGENES:
- Se permite un máximo de 3 URLs por producto
- Las imágenes deben ser URLs válidas (empezar con http:// o https://)
- Se ignoran las URLs vacías o null
- Al obtener un producto, las imágenes vienen en un array: imagen_url[]

CAMPOS DESCRITOS (PRODUCTOS):
- nombre: Nombre del producto (string)
- precio: Precio base del producto (número)
- categoria: Categoría del producto (string)
- stock: Cantidad disponible en inventario (número)
- disponible: Si el producto está disponible para compra (boolean)
- descripcion: Descripción completa del producto (string de texto libre)
- imagen_url: Array de URLs de imágenes (máx 3)
- opciones: Array de opciones de personalización/especificaciones

OPCIONES DE PERSONALIZACIÓN:
- Son especificaciones adicionales que agrega un costo al producto
- Ejemplos: colores, tamaños, garantías extendidas, etc.
- Cada opción tiene un nombre y un precio_adicional
- Al seleccionar una opción en el carrito, se suma su precio al total

VALIDACIONES AUTOMÁTICAS:
- IDs inválidos devuelven error 400
- Productos/opciones/direcciones no encontrados devuelven error 404
- Faltan campos requeridos devuelven error 400
- Tipos de datos incorrectos devuelven error 400
- Más de 3 imágenes devuelven error 400
- Contraseña débil devuelve error 400
- Usuario/email duplicado devuelve error 400

CÓDIGOS DE ERROR COMUNES:
- 200: OK - Solicitud exitosa
- 201: Created - Recurso creado exitosamente
- 400: Bad Request - Error en los datos enviados
- 401: Unauthorized - Token inválido o no proporcionado
- 403: Forbidden - Acceso denegado (no suficientes permisos)
- 404: Not Found - Recurso no existe
- 500: Internal Server Error - Error en el servidor

DISTRITOS:
- Se obtienen mediante GET /api/addresses/districts
- Cada distrito tiene id y nombre
- Se usan al crear/actualizar direcciones (enviar distrito_id)

CARRITO:
- Cada usuario tiene un carrito único
- Los items se agregan con producto_id, cantidad y opciones
- El carrito calcula automáticamente el total
- Se puede sincronizar para fusionar carrito local con servidor

DIRECCIONES:
- Cada usuario puede tener múltiples direcciones
- Se pueden dar nombres: "Casa", "Oficina", etc.
- Se necesita un distrito_id válido
- Campos: calle, numero, referencia (opcional), nombre_direccion (opcional)


================================================================================
                        EJEMPLOS DE FLUJO COMPLETO
================================================================================

FLUJO 1: USUARIO NUEVO - REGISTRO Y COMPRA
────────────────────────────────────────────────────────────────────────────
1. Registrarse:
   POST /api/auth/register
   body: { usuario, email, password, fecha_nacimiento, sexo }

2. Iniciar sesión:
   POST /api/auth/login
   body: { usuario, password }
   → Guardar token en localStorage

3. Completar perfil:
   PUT /api/users/profile
   body: { telefono }

4. Ver productos disponibles:
   GET /api/products

5. Ver detalles de producto (con opciones):
   GET /api/products/1

6. Crear dirección de envío:
   POST /api/addresses
   body: { calle, numero, distrito_id, nombre_direccion }

7. Agregar producto al carrito:
   POST /api/cart/items
   body: { producto_id, cantidad, opciones }

8. Ver carrito:
   GET /api/cart

9. Proceder al pago (en desarrollo)


FLUJO 2: ADMIN - GESTIONAR PRODUCTOS
────────────────────────────────────────────────────────────────────────────
1. Iniciar sesión como admin:
   POST /api/auth/login

2. Crear nuevo producto:
   POST /api/products
   body: { nombre, precio, categoria, stock, descripcion, imagenUrls }

3. Crear opciones de personalización:
   POST /api/products/1/options
   body: { nombre, precio_adicional }
   (Repetir para cada opción)

4. Ver producto con opciones:
   GET /api/products/1

5. Actualizar producto:
   PUT /api/products/1
   body: { descripcion, precio, stock, ... }

6. Actualizar opción:
   PUT /api/products/1/options/5
   body: { nombre, precio_adicional }


FLUJO 3: ADMIN - GESTIONAR USUARIOS
────────────────────────────────────────────────────────────────────────────
1. Iniciar sesión como admin:
   POST /api/auth/login

2. Ver todos los usuarios:
   GET /api/admin/users

3. Ver usuario específico:
   GET /api/admin/users/2

4. Cambiar rol de usuario (a trabajador):
   PUT /api/admin/users/2/role
   body: { rol: 2 }

5. Desactivar usuario problemático:
   PUT /api/admin/users/2/deactivate

6. Activar usuario de nuevo:
   PUT /api/admin/users/2/activate


================================================================================
                        GUÍA RÁPIDA POR ROL
================================================================================

USUARIO NORMAL (rol 1):
✓ POST /api/auth/register - Registrarse
✓ POST /api/auth/login - Iniciar sesión
✓ POST /api/auth/logout - Cerrar sesión
✓ GET /api/users/profile - Ver su perfil
✓ PUT /api/users/profile - Actualizar su perfil
✓ GET /api/products - Ver productos
✓ GET /api/products/:id - Ver detalles
✓ GET /api/addresses/districts - Ver distritos
✓ GET /api/addresses - Ver sus direcciones
✓ POST /api/addresses - Crear dirección
✓ PUT /api/addresses/:id - Editar su dirección
✓ DELETE /api/addresses/:id - Eliminar su dirección
✓ GET /api/cart - Ver su carrito
✓ POST /api/cart/items - Agregar al carrito
✓ PUT /api/cart/items/:id - Editar carrito
✓ DELETE /api/cart/items/:id - Remover del carrito

TRABAJADOR (rol 2):
✓ Todos los permisos del Usuario Normal
✓ POST /api/products - Crear productos (en desarrollo)
✓ PUT /api/products/:id - Editar productos (en desarrollo)
✓ POST /api/products/:id/options - Crear opciones (en desarrollo)
✓ PUT /api/products/:id/options/:id - Editar opciones (en desarrollo)

ADMINISTRADOR (rol 3):
✓ Todos los permisos del Trabajador
✓ DELETE /api/products/:id - Eliminar productos
✓ DELETE /api/products/:id/options/:id - Eliminar opciones
✓ POST /api/auth/admin/register - Crear nuevos admin
✓ GET /api/admin/users - Ver todos los usuarios
✓ GET /api/admin/users/:id - Ver usuario específico
✓ PUT /api/admin/users/:id/role - Cambiar rol
✓ PUT /api/admin/users/:id/activate - Activar usuario
✓ PUT /api/admin/users/:id/deactivate - Desactivar usuario
================================================================================
