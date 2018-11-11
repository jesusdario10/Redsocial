'use strict'
var express = require('express');
var userController = require('../controllers/userController');
var api = express.Router()
var md_auth = require('../middlewares/autenticated');

var multipart = require('connect-multiparty');
//creamos el middleware multiparty
var md_upload = multipart({uploadDir : './uploads/users'});

//==================================AQUI VAN LOS GET=========================================//

//HOME
api.get('/home', md_auth.ensureAuth, userController.home);
//OBTENER DATOS DE UN USUARIO
api.get('/user/:id', md_auth.ensureAuth, userController.getUser);
//OBTENER TODOS LOS USUARIOS
api.get('/users/:page?', md_auth.ensureAuth, userController.getUsers);
//OBTENER LA IMAGEN DE AVATAR DEL USUARIO
api.get('/get-image-user/:imageFile',   userController.getImageFile);
//OBTENER LOS CONTADORES DE SEGUIDOS Y SEGUIDORES DE UN USUARIO
api.get('/counters/:id?', md_auth.ensureAuth,  userController.getCounters);



//===================================AQUI VAN LOS POST======================================//

//REGISTRAR USUARIO
api.post('/register', userController.saveUser);
//LOGIN DE USUARIO
api.post('/login', userController.loginUser);
//SUBIR IMAGEN DE USUARIO PARA AVATAR
api.post('/uploadimage/:id', [md_auth.ensureAuth, md_upload], userController.uploadImage);



//===================================AQUI VAN LOS PUT=======================================//

api.put('/updateuser/:id', md_auth.ensureAuth, userController.updateUser );


module.exports = api;