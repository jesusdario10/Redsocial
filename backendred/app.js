'use strict'
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//cors y cabeceras
// configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//cargando ficheros de rutas
var userRoutes = require('./routes/userRoutes');
var followRoutes = require('./routes/followRoutes');
var publicationRoutes = require('./routes/publicationRoutes');
var messageRoutes = require('./routes/messageRoutes');

//middleware para definir la ruta base
app.use('/api', userRoutes);
app.use('/api', followRoutes);
app.use('/api', publicationRoutes);
app.use('/api', messageRoutes);






module.exports = app;