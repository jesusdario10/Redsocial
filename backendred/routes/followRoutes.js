'use strict'
var express = require('express');
var followController = require('../controllers/followController');

var api = express.Router();

var md_auth = require('../middlewares/autenticated');

//===============RUTAS GET=======================================//
    /*-----------prueba-----------------------------*/
api.get('/pruebas', md_auth.ensureAuth, followController.prueba);
    /*-----------listar usuarios seguidos-----------*/
api.get('/following/:id?/:page?', md_auth.ensureAuth, followController.getFollowindUsers);
    /*-----------listar usuarios que me siguen------*/
api.get('/followed/:id?/:page?', md_auth.ensureAuth, followController.getFollowedUsers);



//===============RUTAS POST======================================//
api.post('/save-follow', md_auth.ensureAuth, followController.saveFollow);



//===============RUTAS DELETE====================================//
api.delete('/delete-follow/:id', md_auth.ensureAuth, followController.deleteFollow);

module.exports = api;