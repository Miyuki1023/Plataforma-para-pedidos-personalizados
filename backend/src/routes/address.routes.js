const express = require('express');
const router = express.Router();

const addressController = require('../controllers/address.controller');
const validate = require('../middlewares/validate');
const { verifyToken } = require('../middlewares/auth');
const {
  createAddressValidation,
  updateAddressValidation
} = require('../validators/address.validator');

// Obtener todos los distritos (público - para formularios)
router.get('/districts', addressController.getDistricts);

// Obtener direcciones del usuario
router.get('/', verifyToken, addressController.getUserAddresses);

// Obtener dirección específica por ID
router.get('/:id', verifyToken, addressController.getAddressById);

// Crear nueva dirección
router.post(
  '/',
  verifyToken,
  createAddressValidation,
  validate,
  addressController.createAddress
);

// Actualizar dirección
router.put(
  '/:id',
  verifyToken,
  updateAddressValidation,
  validate,
  addressController.updateAddress
);

// Eliminar dirección
router.delete('/:id', verifyToken, addressController.deleteAddress);

module.exports = router;