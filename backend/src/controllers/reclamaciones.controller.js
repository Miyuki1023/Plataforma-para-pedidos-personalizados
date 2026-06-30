const reclamacionesService = require('../services/reclamaciones.service');

const categoryMap = {
  recommendation: 'recommendation',
  feedback: 'feedback',
  complaint: 'complaint',
  question: 'question',
  Recomendación: 'recommendation',
  Sugerencia: 'feedback',
  Queja: 'complaint',
  Pregunta: 'question'
};

exports.createReclamacion = async (req, res) => {
  try {
    const tipo_mensaje = categoryMap[req.body.category] || req.body.category;

    const reclamacion = await reclamacionesService.createReclamacion({
      nombre: req.body.name,
      email: req.body.email,
      tipo_mensaje,
      calificacion: Number(req.body.rating ?? 0),
      mensaje: req.body.message
    });

    res.status(201).json({
      message: 'Reclamación registrada correctamente',
      reclamacion
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getReclamaciones = async (req, res) => {
  try {
    const reclamaciones = await reclamacionesService.getAllReclamaciones();
    res.json({ data: reclamaciones });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
