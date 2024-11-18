const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const employeeRoutes = require('./routes/employeeRoutes');
const pool = require('./config/db');
const bcrypt=require('bcryptjs');
const app = express();
const CORS = require('cors')

// Antes de las rutas
app.use(CORS());

// Middleware
app.use(express.json());
// Rutas
app.use('/api', employeeRoutes);
// Ruta de prueba para generar un token (en un sistema real, esto iría en un controlador de autenticación)
app.post('/login-test', (req, res) => {
// Simulación de usuario
const user = { id: 1, username: 'admin' };
const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h'
});
res.json({ token });
});

//login
app.post('/login', async (req, res) => {
  const { usuario, password } = req.body;

  try {
    // Consulta a la base de datos
    const result = await pool.query('SELECT * FROM usuarios WHERE usuario = $1', [usuario]);
    const user = result.rows[0];

    // Validar si el usuario existe
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
   }

    // Generar el token
    const token = jwt.sign({ id: user.id, usuario: user.usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login exitoso', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
  

module.exports = app;