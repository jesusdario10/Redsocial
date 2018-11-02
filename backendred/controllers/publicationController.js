'use strict'

var path =  require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var PublicationModel = require('../models/publicationModel');
var UsuarioModel = require('../models/userModel');
var FollowModel = require('../models/followModel');

//========pruba==========//
function probando(req, res){
    res.status(200).send({ok:"hola desde publication"});
}

//========================SAVE PUBLICATION==============================//
function savePublication(req, res){
    var body = req.body;

    if(!body.text) return res.status(200).send({message:"debes enviar un texto"})
    
    var publicationModel = new PublicationModel;

    publicationModel.text = body.text;
    publicationModel.file = null;
    publicationModel.user = req.user.sub;// el usuario dueño de la publicacion es decir el usuario logueado
    publicationModel.create_at = moment().unix();

    publicationModel.save((error, publicationStored)=>{
        if(error) return res.status(500).send({message:"error al guardar la publicacion"});
        if(!publicationStored) return res.status(404).send({message:"la publicacion no fue guardada"});

        return res.status(200).send({
            message:"Ok",
            publication : publicationStored
        });
    })
}

//=================GETPUBLICATION================================================//
function getPublications(req, res){
    var id_user = req.user.sub;
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 4;

    FollowModel.find({user:id_user}).populate('followed').exec((error, follows)=>{
        if(error) return res.status(500).send({message:"error al ejecutar la consulta"});
        if(!follows) return res.status(404).send({message:"no sigues a nadie"});

        var follows_clean = [];
        follows.forEach((follow)=>{
            follows_clean.push(follow.followed);//en este array tendre a todos los users que sigo
        })
        /*ahora con la sentencia $in en mongoose buscare todas las publicaciones de esos usuarios
          que estan dentro del array follows_clean*/ /* cor el sort ordenaremos las 
          publicaciones de las nuevas a viejas */
        PublicationModel.find({user:{'$in':follows_clean}}).sort('-created_at').populate('user')
                        .paginate(page, itemsPerPage, (error, publications, total)=>{
                            if(error) return res.status(500).send({message:"error al ejecutar la consulta"});
                            if(!publications) return res.status(404).send({message:"no existen publicaciones"});

                            return res.status(200).send({
                                total_items : total,
                                publicatios: publications,
                                pages : Math.ceil(total/itemsPerPage),
                                page : page
                            });
                        })
    })
}
//=========== GET PUBLICATION ES DECIR CONSEGUIR UNA PUBLICACION POR SU ID QUE NOS LLEGARA POR URL ============
function getPublication(req, res){
    var id_publication = req.params.id;

    PublicationModel.findById(id_publication, (error, publication)=>{
        if(error) return res.status(500).send({message:"error al ejecutar la consulta"});
        if(!publication) return res.status(404).send({message:"no existe la publicacion"});

        return res.status(200).send({
            publicatio: publication,
        });
    })
}

//======================DELETE PUBLICATION========================//
function deletePublication(req, res){
    var id_publication = req.params.id;

    PublicationModel.findByIdAndRemove(id_publication, (error, publicationRemove)=>{
        if(error) return res.status(500).send({message:"error al ejecutar el borrado"});
        if(!publicationRemove) return res.status(404).send({message:"no existe la publicacion"});

        return res.status(200).send({
            publicationRemove: publicationRemove,
        });
    });
}

module.exports = {
    probando,
    savePublication,
    getPublications,
    getPublication,
    deletePublication
}