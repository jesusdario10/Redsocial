'use strict'

var express = require('express');
var api = express.Router();
var md_auth = require('../middlewares/autenticated');
var MessageController = require('../controllers/messageController');

//=========================AQUI VIENEN TODOS LOS GETS================================//
/*Metodo de prueba para los mensajes*/
api.get('/pruebamessage', md_auth.ensureAuth, MessageController.pruebaMessage );
/*Metodo de obtener mensajes que ha recibido el usuario*/
api.get('/my-messages/:page?', md_auth.ensureAuth, MessageController.getReceiverMessage );
/*Metodo de para obtener mensajes que el usuario ha enviado*/
api.get('/messages/:page?', md_auth.ensureAuth, MessageController.getEmmitMessages );
/*Metodo de para contar los mensajes no leidos*/
api.get('/unviewed-messages', md_auth.ensureAuth, MessageController.getUnviewedMessages );
/*Metodo para que al ver los mensajes los pase a leidos o mas bien cambie su estado a true(leidos)*/
api.get('/set-viewed-messages', md_auth.ensureAuth, MessageController.setViewedMessagess );


//=========================AQUI VIENEN TODOS LOS POST================================//

api.post('/message', md_auth.ensureAuth, MessageController.saveMessage );

module.exports = api;