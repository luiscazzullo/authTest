//Importar el modelo
const Users = require('../models/Users');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array });
  }
  const { name, email, password } = req.body;
  try {
    //Controlar que no exista ya dentro de la base de datos
    let user = await Users.findOne({ email });
    //Si el usuario existe, arrojar un error
    if(user) {
      res.status(400).json({ msg: 'El usuario ya existe' });
    }
    user = new Users(req.body);
    //Generar salt
    const salt = await bcryptjs.genSalt(10);
    //Hashear Password
    user.password = await bcryptjs.hash(password, salt);
    await user.save();
    //Generar payload para el JSON Web Token
    const payload = {
      user: {
        id: user._id
      }
    }

    jwt.sign(payload, process.env.SECRET, {
      expiresIn: 3600
    }, (error, token) => {
      if(error) throw error;
      res.json({ token })
    })


  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: 'Hubo un error' });
  }
}