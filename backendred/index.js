'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

//Conexion a la base de datos
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/RedS', {useMongoClient: true})
    .then(()=>{
        console.log("conectado a la db RedS");

        //Crear servidor
        app.listen(port, ()=>{
            console.log("Servidor NodeJS corriendo in port 3800");
        })//-fin de la creacion del servidor
    })
    .catch(err=>{
        console.log("Error al conectarse a la db");
    })