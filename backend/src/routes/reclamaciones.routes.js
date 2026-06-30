const express = require('express');
const router = express.Router();
const reclamacionesController = require('../controllers/reclamaciones.controller');
const validate = require('../middlewares/validate');
const { createReclamacionValidation } = require('../validators/reclamaciones.validator');
const { verifyToken, requireAdmin } = require('../middlewares/auth');

router.post('/', createReclamacionValidation, validate, reclamacionesController.createReclamacion);
router.get('/', verifyToken, requireAdmin, reclamacionesController.getReclamaciones);

module.exports = router;
