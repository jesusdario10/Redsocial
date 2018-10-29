'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MessageSchema = Schema({
    emmiter : {type: Schema.ObjectId, ref :'User'}, //usuario que emite el mensaje
    receiber :{type: Schema.ObjectId, ref :'User'},//usuario recibe el mensaje
    text:String,
    created_at:String
});

moule.exports = mongoose.model('Message', MessageSchema);