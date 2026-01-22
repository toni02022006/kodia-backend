const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); 
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configuración de seguridad (CORS) y lectura de JSON
app.use(cors());
app.use(express.json());

// Conexión a la Base de Datos (Usa la URL que pegaste en Environment)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// NUEVO: Función para crear la tabla de mensajes si no existe
const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mensajes (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100),
        email VARCHAR(100),
        mensaje TEXT,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabla 'mensajes' verificada/creada correctamente.");
  } catch (err) {
    console.error("❌ Error al verificar la tabla:", err);
  }
};

// Ejecutamos la creación al iniciar el servidor
createTable();

// RUTA 1: Prueba de vida (Para ver en el navegador)
app.get('/', (req, res) => {
  res.send('🚀 KODIA Backend está en línea y funcionando.');
});

// RUTA 2: Prueba de Conexión a DB
app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      estado: 'Conectado a PostgreSQL exitosamente', 
      hora_servidor: result.rows[0].now 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error conectando a la Base de Datos' });
  }
});

// RUTA 3: Recibir mensajes del formulario de React
app.post('/contacto', async (req, res) => {
  const { nombre, email, mensaje } = req.body;
  try {
    const query = 'INSERT INTO mensajes (nombre, email, mensaje) VALUES ($1, $2, $3) RETURNING *';
    const values = [nombre, email, mensaje];
    const result = await pool.query(query, values);
    res.status(201).json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fallo al guardar el mensaje' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});