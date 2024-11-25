const express = require('express');
const router = express.Router();
const Hamburguesa = require('../models/hamburguesa');

// Crear hamburguesa
router.post('/', async (req, res) => {
  try {
    const hamburguesa = new Hamburguesa(req.body);
    await hamburguesa.save();
    res.status(201).json(hamburguesa);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtener todas las hamburguesas
router.get('/', async (req, res) => {
  try {
    const hamburguesas = await Hamburguesa.find();
    res.json(hamburguesas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Puntuar hamburguesa
router.put('/:id/puntuar', async (req, res) => {
  try {
    const hamburguesa = await Hamburguesa.findById(req.params.id);
    if (!hamburguesa) return res.status(404).json({ message: 'Hamburguesa no encontrada' });

    hamburguesa.puntuacion += 1;
    await hamburguesa.save();
    res.json(hamburguesa);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Comentar en hamburguesa
router.put('/:id/comentar', async (req, res) => {
  try {
    const hamburguesa = await Hamburguesa.findById(req.params.id);
    if (!hamburguesa) return res.status(404).json({ message: 'Hamburguesa no encontrada' });

    hamburguesa.comentarios.push(req.body.comentario);
    await hamburguesa.save();
    res.json(hamburguesa);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;