const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// Definir un modelo simple
const Persona = mongoose.model('Persona', {
  nombre: String,
  apellido: String
});

// Middleware para habilitar el uso de JSON en las solicitudes
app.use(express.json());

// Ruta para agregar información a la base de datos
app.post('/agregarPersona', async (req, res) => {
  try {
    const { nombre, apellido } = req.body;
    const nuevaPersona = new Persona({ nombre, apellido });
    await nuevaPersona.save();
    res.json({ mensaje: 'Persona agregada con éxito a la base de datos' });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar persona a la base de datos' });
  }
});

// Ruta para obtener todas las personas
app.get('/obtenerPersonas', async (req, res) => {
  try {
    const personas = await Persona.find();
    res.json(personas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener personas de la base de datos' });
  }
});

// Ruta para modificar persona por nombre
app.put('/modificarPersona/:nombre', async (req, res) => {
  try {
    const { nombre } = req.params;
    const { apellido } = req.body;

    const personaModificada = await Persona.findOneAndUpdate(
      { nombre },
      { apellido },
      { new: true }
    );

    if (personaModificada) {
      res.json(personaModificada);
    } else {
      res.status(404).json({ mensaje: 'Persona no encontrada' });
    }
  } catch (error) {
    console.error(error);  // Agrega esta línea para imprimir el error en la consola
    res.status(500).json({ error: 'Error al modificar persona en la base de datos' });
  }
});

// Ruta para eliminar persona por nombre
app.delete('/eliminarPersona/:nombre', async (req, res) => {
  try {
    const { nombre } = req.params;

    const personaEliminada = await Persona.findOneAndDelete({ nombre });

    if (personaEliminada) {
      res.json({ mensaje: 'Persona eliminada con éxito' });
    } else {
      res.status(404).json({ mensaje: 'Persona no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar persona de la base de datos' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
