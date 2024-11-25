const express = require('express');
const { ObjectId } = require('mongodb');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectDB, getDb } = require('./db');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Conectar a la base de datos
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB', err));

// Rutas
app.use('/hamburguesas', hamburguesaRoutes);
app.use('/usuarios', usuarioRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
// Configuración de Multer para manejar archivos subidos
const upload = multer({ dest: 'uploads/' });

// Conectar a MongoDB
connectDB();

// Ruta para actualizar el perfil del usuario
app.post('/perfil', upload.single('foto-perfil'), async (req, res) => {
    const db = getDb();
    const { nombre, username, descripcion } = req.body;
    let fotoPerfilUrl = null;
    if (req.file) {
        // Generar la URL de la foto de perfil (ajusta según tu configuración de almacenamiento)
        fotoPerfilUrl = path.join('uploads', req.file.filename);
    }
    try {
        const perfil = await db.collection('user_profiles').findOneAndUpdate(
            { username },
            { $set: { nombre, username, descripcion, fotoPerfil: fotoPerfilUrl } },
            { returnOriginal: false, upsert: true }
        );
        res.status(200).json(perfil.value);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para obtener el perfil del usuario
app.get('/perfil/:username', async (req, res) => {
    const db = getDb();
    const { username } = req.params;
    try {
        const perfil = await db.collection('user_profiles').findOne({ username });
        if (perfil) {
            res.status(200).json(perfil);
        } else {
            res.status(404).json({ message: 'Perfil no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para listar las hamburguesas del usuario
app.get('/hamburguesas/:username', async (req, res) => {
    const db = getDb();
    const { username } = req.params;
    try {
        const usuario = await db.collection('user_profiles').findOne({ username });
        if (usuario) {
            const hamburguesas = await db.collection('burgers').find({ user: usuario._id }).toArray();
            res.status(200).json(hamburguesas);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para agregar una hamburguesa
app.post('/hamburguesas', async (req, res) => {
    const db = getDb();
    const { username, name, ingredients, rating, design, credits } = req.body;
    try {
        const usuario = await db.collection('user_profiles').findOne({ username });
        if (usuario) {
            const hamburguesa = {
                user: usuario._id,
                name,
                ingredients,
                rating,
                design,
                credits
            };
            const result = await db.collection('burgers').insertOne(hamburguesa);
            res.status(201).json(result.ops[0]);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para obtener todas las hamburguesas
app.get('/hamburguesas', async (req, res) => {
    const db = getDb();
    try {
        const hamburguesas = await db.collection('burgers').find().toArray();
        res.json(hamburguesas);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener hamburguesas', details: err.message });
    }
});

// Ruta para obtener una hamburguesa por ID
app.get('/hamburguesas/:id', async (req, res) => {
    const db = getDb();
    const { id } = req.params;
    try {
        const hamburguesa = await db.collection('burgers').findOne({ _id: new ObjectId(id) });
        if (hamburguesa) {
            res.json(hamburguesa);
        } else {
            res.status(404).json({ error: 'Hamburguesa no encontrada' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener hamburguesa', details: err.message });
    }
});

// Ruta para actualizar una hamburguesa por ID
app.put('/hamburguesas/:id', async (req, res) => {
    const db = getDb();
    const { id } = req.params;
    const actualizaciones = req.body;
    try {
        const result = await db.collection('burgers').updateOne(
            { _id: new ObjectId(id) },
            { $set: actualizaciones }
        );
        if (result.matchedCount > 0) {
            const updatedHamburguesa = await db.collection('burgers').findOne({ _id: new ObjectId(id) });
            res.json(updatedHamburguesa);
        } else {
            res.status(404).json({ error: 'Hamburguesa no encontrada' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar hamburguesa', details: err.message });
    }
});

// Ruta para eliminar una hamburguesa por ID
app.delete('/hamburguesas/:id', async (req, res) => {
    const db = getDb();
    const { id } = req.params;
    try {
        const result = await db.collection('burgers').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount > 0) {
            res.json({ message: 'Hamburguesa eliminada con éxito' });
        } else {
            res.status(404).json({ error: 'Hamburguesa no encontrada' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar hamburguesa', details: err.message });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});