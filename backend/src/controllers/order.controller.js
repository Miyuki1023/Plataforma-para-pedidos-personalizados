const orderService = require('../services/order.service');

// Crear orden desde carrito
exports.createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrderFromCart(req.user.id, req.body);
    res.status(201).json({
      message: 'Pedido creado exitosamente',
      order
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener pedidos (cliente ve solo sus pedidos, empleado/admin ven todos)
exports.getOrders = async (req, res) => {
  try {
    // Cliente (rol 1) - solo sus pedidos
    if (req.user.rol === 1) {
      const orders = await orderService.getUserOrders(req.user.id, {
        estado_pedido: req.query.estado_pedido,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20
      });

      const total = await orderService.getOrdersCount({ id_cliente: req.user.id });

      return res.json({
        orders,
        pagination: {
          total,
          page: parseInt(req.query.page) || 1,
          limit: parseInt(req.query.limit) || 20
        }
      });
    }

    // Empleado/Admin - todos los pedidos
    let orders;

    // Si se proporcionan fecha_inicio y fecha_fin, filtrar por rango de fechas (para calendario)
    if (req.query.fecha_inicio && req.query.fecha_fin) {
      orders = await orderService.getOrdersByDateRange(
        req.query.fecha_inicio,
        req.query.fecha_fin,
        { estado_pedido: req.query.estado_pedido }
      );

      return res.json({
        orders,
        filtro: {
          fecha_inicio: req.query.fecha_inicio,
          fecha_fin: req.query.fecha_fin,
          estado_pedido: req.query.estado_pedido
        }
      });
    }

    // Si no hay filtro de fechas, aplicar filtros normales (estado_pedido, id_cliente) y paginación
    orders = await orderService.getAllOrders({
      estado_pedido: req.query.estado_pedido,
      id_cliente: req.query.id_cliente,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20
    });

    const total = await orderService.getOrdersCount({
      estado_pedido: req.query.estado_pedido,
      id_cliente: req.query.id_cliente
    });

    return res.json({
      orders,
      pagination: {
        total,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20
      }
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener pedido individual
exports.getOrderById = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);

    // Obtener información básica del pedido primero
    const orderInfo = await orderService.searchOrderById(orderId);

    // El cliente solo puede ver sus propios pedidos
    if (req.user.rol === 1 && orderInfo.id_cliente !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    // Obtener detalles completos
    const order = await orderService.getOrderDetails(orderId);
    res.json({ order });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Buscar pedido por ID (para cliente, solo si es su pedido; para empleado/admin cualquier pedido)
exports.searchOrder = async (req, res) => {
  try {
    const orderId = parseInt(req.query.id_pedido);

    const order = await orderService.searchOrderById(orderId);

    // El cliente solo puede ver su propio pedido
    if (req.user.rol === 1 && order.id_cliente !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    // Obtener detalles completos del pedido
    const fullOrder = await orderService.getOrderDetails(orderId);
    res.json({ order: fullOrder });

  } catch (error) {
    if (error.message === 'Pedido no encontrado') {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
};

// Actualizar estado del pedido (empleado/admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { estado_pedido } = req.body;

    // Verificar que el pedido existe
    const orderInfo = await orderService.searchOrderById(orderId);

    const result = await orderService.updateOrderStatus(orderId, estado_pedido);

    res.json({
      message: 'Estado del pedido actualizado exitosamente',
      order: {
        id_pedido: result.id_pedido,
        estado_pedido: result.estado_pedido
      }
    });

  } catch (error) {
    if (error.message === 'Pedido no encontrado') {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
};

// Asignar trabajador a pedido (admin)
exports.assignWorker = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { id_trabajador_asignado } = req.body;

    // Verificar que el pedido existe
    await orderService.searchOrderById(orderId);

    const result = await orderService.assignWorkerToOrder(orderId, id_trabajador_asignado);

    res.json({
      message: 'Trabajador asignado exitosamente',
      order: {
        id_pedido: result.id_pedido,
        id_trabajador_asignado: result.id_trabajador_asignado
      }
    });

  } catch (error) {
    if (error.message === 'Pedido no encontrado') {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
};

// Obtener pedidos por rango de fechas (para calendario - empleado/admin)
exports.getOrdersByDate = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, estado_pedido } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        message: 'Debe proporcionar fecha_inicio y fecha_fin'
      });
    }

    const orders = await orderService.getOrdersByDateRange(
      fecha_inicio,
      fecha_fin,
      { estado_pedido }
    );

    res.json({
      orders,
      filtro: {
        fecha_inicio,
        fecha_fin,
        estado_pedido: estado_pedido || null
      }
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
