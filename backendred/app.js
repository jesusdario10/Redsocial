'use strict'
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//cargar rutas
app.post('/', (req, res)=>{
    console.log(req.body);
    res.status(200).json({
        message:'Accion de pruebas en el servidor de NodeJs'
    })
})

//cors y cabeceras

//rescribir rutas

module.exports = app;