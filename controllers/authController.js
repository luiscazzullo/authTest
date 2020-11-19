const Users = require('../models/Users');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.authUser = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array })
  }
  const { email, password } = req.body;
  try {
    let user = await Users.findOne({ email });
    if(!user) {
      res.status(400).json({ msg: 'El usuario no existe' })
    }
    let correctPass = await bcryptjs.compare(password, user.password);
    if(!correctPass) {
      res.status(400).json({ msg: 'La contraseña no es correcta' });
    }
    const payload = {
      user: {
        id: user._id
      }
    }
    jwt.sign(payload, process.env.SECRET, {
      expiresIn: 3600
    }, (error, token) => {
      if(error) throw error;
      res.json({ token: `Bearer ${token}`});
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: 'Hubo un error' });
  }
}

exports.getAuthUser = async (req, res) => {
  try {
    const user = await (await Users.findById(req.user.id)).select('-password');
    res.json({ user })
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Hubo un error' })
  }
}