'use strict'
var express = require('express');
var userController = require('../controllers/userController');
var api = express.Router()
var md_auth = require('../middlewares/autenticated');

//HOME
api.get('/home', md_auth.ensureAuth, userController.home);
//OBTENER DATOS DE UN USUARIO
api.get('/user/:id', md_auth.ensureAuth, userController.getUser);
//OBTENER TODOS LOS USUARIOS
api.get('/users/:page?', md_auth.ensureAuth, userController.getUsers);





//REGISTRAR USUARIO
api.post('/register', userController.saveUser);
//LOGIN DE USUARIO
api.post('/login', userController.loginUser);
module.exports = api;