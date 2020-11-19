const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');


const app = express();
const PORT = process.env.PORT || 4000;

//Conexión a la base de datos
connectDB();
//Habilitamos los request desde cualquier URL
app.use(cors());
//Leer los archivos JSON
app.use(express.json({ extended: true}));

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Aplicación corriendo en el puerto ${PORT}`);
})