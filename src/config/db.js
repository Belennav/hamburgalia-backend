const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI; // Asegúrate de que `process.env.MONGO_URI` esté definido
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let db;

const connectDB = async () => {
    try {
        await client.connect();
        db = client.db(); // Puedes especificar el nombre de la base de datos si lo prefieres, por ejemplo: client.db('Hamburgalia');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const getDb = () => {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
};

module.exports = { connectDB, getDb };

