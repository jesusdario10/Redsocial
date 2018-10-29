'use strict'

var UserModel = require('../models/userModel');

//probaremos el home aqui
function home(req, res){
    console.log(req.body);
    res.status(200).send({
        message:'Esto es una prueba en el home'
    })
}

module.exports = {
    home
}