'use strict'

//var path = require('path');
//var fs = require('fs');
var UserModel = require('../models/userModel');
var FollowModel = require('../models/followModel');
var mongossePaginate = require('mongoose-pagination');

function prueba(req, res){
  return  res.status(200).send({ok:"hola mundo desde flollows"});
}
//========================SEGUIR A UN USUARIO====================================//
function saveFollow(req, res){
    var body = req.body;
    var follow = new FollowModel();

    follow.user = req.user.sub; //este es el usuario que esta logueado y que mas adelante seguira a otro
    follow.followed = body.followed;// este es el usuario que sera seguido

    //no permitir seguirse a uno mismo
    if(req.user.sub == body.followed){
        return res.status(500).send({message:"no puedes seguirte a ti mismo"});
    }

    //valida si ya se sigue al este usuario y es asi no lo permite
    FollowModel.find({"user": req.user.sub, "followed": body.followed}, (err, existe)=>{
        if(err) return res.status(500).send({message:"no se pudo realizar la operacion"});
        console.log(existe.length );
        if(existe.length == 1){
            return res.status(200).send({message:"ya estas siguiendo a este usuario"});
        }else{
            follow.save((error, followStored)=>{//Stored el ingles es almacenamiento(user seguido almacenado)
                if(error) return res.status(500).send({message:"error al seguir"});
                if(!followStored) return res.status(404).send({message:"el seguimiento no se ha guardado"});
        
                return res.status(200).send({message:followStored});
            });
        }
        


    })



}
//=========================DEJAR DE SEGUIR A UN USUARIO============================//
function deleteFollow(req, res){
    var userId = req.user.sub;//yo
    var followId = req.params.id;//usuario que dejare de seguir
    
    FollowModel.find({'user':userId, 'followed':followId}).remove(error=>{
        if(error) return res.status(500).send({message:"error al dejar de seguir"});

        return res.status(200).send({message:'el follow se ha eliminado'});
    });
}
//===========================LISTAR A LOS USUARIOS QUE SIGO==========================//
function getFollowindUsers(req, res){
    var userId = req.user.sub;//recojo el usuario logueado
    var page = 1;// numero de paginas por defecto

    if(req.params.page){
        page = req.params.page;
    }
    var itemsPerPage = 4;//numero de usuarios por pgina

    FollowModel.find({'user':userId})
               .populate({path:'followed', select:'name'}).paginate(page, itemsPerPage, (error, follows, total)=>{

                if(error) return res.status(500).send({message:"error al traer los datos"});
                if(!follows) return res.status(404).send({message:"no sigues a nadie"});
                
                return res.status(200).send({
                                                total,
                                                pages: Math.ceil(total/itemsPerPage),
                                                follows
                                           });
    })

}
//==============================LISTAR LOS USUARIOS QUE NOS SIGUEN======================//
function getFollowedUsers(req, res){
    var userId = req.user.sub;
    console.log(userId);

    FollowModel.find({"followed": userId})
               .populate({path:'user', select:'name'})
               .exec((error, followeds)=>{
                    if(error) return res.status(500).send({message:"error al traer los datos"});
                    if(!followeds) return res.status(404).send({message:"no te sigue nadie"});
                    return  res.status(200).send({followeds});
                });
}

module.exports = {
    prueba,
    saveFollow,
    deleteFollow,
    getFollowindUsers,
    getFollowedUsers
}