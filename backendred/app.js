'use strict'
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//cargando ficheros de rutas
var userRoutes = require('./routes/userRoutes');

//middleware para definir la ruta base
app.use('/api', userRoutes);


//cors y cabeceras

//

module.exports = app;