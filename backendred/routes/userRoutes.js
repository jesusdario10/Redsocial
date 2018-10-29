'use strict'
var express = require('express');
var userController = require('../controllers/userController');
var api = express.Router();

api.get('/home', userController.home);

module.exports = api;