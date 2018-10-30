'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret ='clave_secreta_aprendiendo_mas_angular'/*este es un String secreto que solo nosotros como
 programadores sabremos, el token es casi que imposible de descifrarlo sin esta clave*/

 exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({message:"La peticion no tiene la cabecera de autenticacion"});
    }
    //aqui cargamos el token
    var token = req.headers.authorization.replace(/['"]+/g,'');//remplaza cualquier comilla doble o simple por vacio

    try{
          //decodificamos el token
          var payload = jwt.decode(token, secret);/* el payload es sencible a errores y exepciones que 
          causa que la aplicacion pare por eso lo meto en un try cacth*/

          //si la fecha de expiracion es menor que la actual diga que expiro
          if(payload.exp <=moment().unix()){
            return res.status(401).send({message:"Token expiro"});
          }
        }catch(ex){
          return res.status(404).send({message:"el token no es valido"});
        }
        //adjuntamos el payload a la req para tener siempre a la mano dentro de los controladores el objeto del usuario logeado
        req.user = payload;
        //ahora hacemos uso del metodo next para pasar a la siguiente accion
        next();
   
 }