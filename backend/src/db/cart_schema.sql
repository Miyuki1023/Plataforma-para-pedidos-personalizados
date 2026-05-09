-- Cart schema for backend synchronization

CREATE TABLE IF NOT EXISTS carrito (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuario(id),
  creado_en TIMESTAMP DEFAULT NOW(),
  actualizado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS carrito_item (
  id SERIAL PRIMARY KEY,
  carrito_id INTEGER NOT NULL REFERENCES carrito(id) ON DELETE CASCADE,
  producto_id INTEGER NOT NULL REFERENCES producto(id),
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  opciones JSONB,
  clave_personalizacion TEXT NOT NULL,
  precio_unitario NUMERIC(10,2) NOT NULL,
  creado_en TIMESTAMP DEFAULT NOW(),
  actualizado_en TIMESTAMP DEFAULT NOW(),
  UNIQUE (carrito_id, producto_id, clave_personalizacion)
);
