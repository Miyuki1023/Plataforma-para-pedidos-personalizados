const test = require('node:test');
const assert = require('node:assert/strict');

const orderService = require('../src/services/order.service');

test('buildCreateOrderPayload uses the actual pedido schema columns', () => {
  const payload = orderService.buildCreateOrderPayload({
    userId: 12,
    id_direccion: 4,
    metodo_pago: 'Yape',
    codigo_pago: '1234',
    fecha_entrega: '2026-06-20',
    horario_entrega: 'Mañana (07:00 - 09:00)',
    costo_envio: 10,
    total: 85.5,
  });

  assert.deepEqual(payload, {
    id_cliente: 12,
    id_direccion: 4,
    total: 85.5,
    estado_pedido: 'pendiente',
    metodo_pago: 'Yape',
    codigo_pago: '1234',
    fecha_entrega: '2026-06-20',
    horario_entrega: 'Mañana (07:00 - 09:00)',
    costo_envio: 10,
  });
});

test('normalizeOrderItems maps frontend cart items to backend order items', () => {
  const items = orderService.normalizeOrderItems([
    { id: 7, quantity: 2, price: 50 },
    { producto_id: 8, cantidad: 1, precio_unitario: 20, opciones: ['extra'] }
  ]);

  assert.deepEqual(items, [
    { producto_id: 7, cantidad: 2, precio_unitario: 50, opciones: null },
    { producto_id: 8, cantidad: 1, precio_unitario: 20, opciones: ['extra'] }
  ]);
});
