'use strict'

var UserModel = require('../models/userModel');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

//probaremos el home aqui
function home(req, res){
    console.log(req.body);
    res.status(200).send({
        message:'Esto es una prueba en el home'
    })
}
//==========Guardar usuario=================//
function saveUser(req, res){
    var user = new UserModel();
    var params = req.body;
    
    if(params.name && params.surname && params.nick && params.email && params.password){
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role ='ROLE_USER';
        user.image = null;
        //Validndo si un existe un usuario antes de guardarlo
        UserModel.find({$or:[//1.busco con un or es decir si el email es igual o si el nick es igual
                            {email: user.email.toLowerCase()}, //si el email es igual al email que trae la instancia
                            {nick: user.nick.toLowerCase()}// si el nick es igual al nick que trae la instancia
            ]}).exec((err, users)=>{
                if(err) return res.status(500).send({message:"Error en la peticion de usuarios"});
                if(users && users.length >= 1){
                    /*utilizaremos una clausula de guarda que es llegar a un punto del código y retornar un resultado
                     para que el código llegue y solo llegue hasta allí. con esto el bcrypt y el codigo que sigue no 
                     se ejecutara, esto se hace para ahorrarnos callback, if anidados y codigo de ejecucion*/
                    return res.status(200).send({message:"el usuario que intenta registrar ya existe"});
                }else{
                    //encriptando el password(solo si el find anterior en su ultima condicion es decir if(users && users.length >= 1)
                    // es falso llegara a este punto)
                    bcrypt.hash(params.password, null, null, (err, hash)=>{
                        user.password = hash;

                        //guardando el usuario el la base de datos:
                        user.save((err, userGuardado)=>{
                            if(err) res.status(500).send({message:"error al gaurdar el usuario"});

                            if(userGuardado){
                                res.status(200).send({user:userGuardado});
                            }else{
                                res.status(404).send({message:"No se ha registrado el usuario"});
                            }

                        });
                    });
                }
            });
    }else{
        res.status(200).send({
            message:"Todos los datos son necesrios"
        })
    }
}
//==============================Login de Usuario===============================//
function loginUser(req, res){
    var body = req.body;
    var email = body.email;
    var password = body.password;

    UserModel.findOne({email:email}, (err, user)=>{
        if(err) res.status(500).send({message:"error al gaurdar el usuario"});
        if(user){
            bcrypt.compare(password, user.password, (err, check)=>{
                if(check){
                    //generar y devolver el token que contiene el usuario encriptado con el secret
                    if(body.gettoken){
                        return res.status(200).send({token: jwt.createToken(user)})
                    }else{
                        //devolvemos el usuario normal
                        user.password = undefined;
                        return res.status(200).send({
                            message:"Usuario Logueado correctamente",
                            user:user,
                            check:check
                        });
                    }
   
                }else{
                    return res.status(404).send({message:"el usuario no pudo ser identificado"});//si la contraseña es incorrecta
                }
            });
        }else{
            return res.status(504).send({message:"el usuario no pudo ser identificado!!"});
        }
    });
}

module.exports = {
    home,
    saveUser,
    loginUser
}