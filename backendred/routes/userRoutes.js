'use strict'
var express = require('express');
var userController = require('../controllers/userController');
var api = express.Router()
var md_auth = require('../middlewares/autenticated');

api.get('/home', md_auth.ensureAuth, userController.home);
api.post('/register', userController.saveUser);
api.post('/login', userController.loginUser);
module.exports = api;