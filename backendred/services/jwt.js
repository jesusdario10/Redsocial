'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret ='clave_secreta_aprendiendo_mas_angular'/*este es un String secreto que solo nosotros como
 programadores sabremos, el token es casi que imposible de descifrarlo sin esta clave*/

exports.createToken =  function(user){
    //variable que contendra los datos que quiero codificar
    var payload = {
        sub:user._id,
        name:user.name,
        surname : user.surname,
        nick : user.nick,
        email : user.email,
        rool : user.role,
        image : user.image,
        iat: moment().unix(), // fecha de creacion del token
        exp: moment().add(1, 'days').unix//fecha de expiracion  a la fecha actual le añadimos 30 dias
    };
    //el metodo encode lo codifica todo y genera un hash con ayuda de la clave secret
    return jwt.encode(payload, secret);
}