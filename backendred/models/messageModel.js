'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MessageSchema = Schema({
    emitter : {type: Schema.ObjectId, ref :'User'}, //usuario que emite el mensaje
    receiver :{type: Schema.ObjectId, ref :'User'},//usuario recibe el mensaje
    text:String,
    created_at:String,
    viewed : String //este campo guaradra si el mensaje esta visto o no esta visto
});

module.exports = mongoose.model('Message', MessageSchema);