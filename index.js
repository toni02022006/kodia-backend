// index.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Librería para PostgreSQL
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configuración de seguridad (CORS)
app.use(cors());
app.use(express.json());

// Conexión a la Base de Datos (Usará la URL de Dokploy)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// RUTA 1: Prueba de vida (Para saber si el servidor funciona)
app.get('/', (req, res) => {
  res.send('🚀 KODIA Backend está en línea y funcionando.');
});

// RUTA 2: Prueba de Base de Datos (Para ver si guarda datos)
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

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});