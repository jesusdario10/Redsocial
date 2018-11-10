'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = Schema({
    name: String,
    surname : String,
    nick : String,
    email: {type:String, unique:true, required: [true, "El correo es requerido"]},
    password : String,
    role : String,
    image : String
})
module.exports = mongoose.model('User', UserSchema);