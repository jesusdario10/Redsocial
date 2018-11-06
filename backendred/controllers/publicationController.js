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

    //de esta manera puedo ta,bien eliminar documentos, puedes observar que solo se elimina el documento
    //de la publicacion si es el usuario que lo creo el que hace la solicitud
    PublicationModel.remove({'user':req.user.sub, '_id':id_publication}).exec((error, publicationRemove)=>{
        if(error) return res.status(500).send({message:"error al borrar la publicacion"});
        if(!publicationRemove) return res.status(404).send({message:"no existe la publicacion"});

        res.status(200).send({publication:publicationRemove});
    });
}
//===============================SUBIR IMAGEN DE LA PUBLICACION===========================//
function uploadImage(req, res){
    //regoge desde la url el id del usuario que vamos a actualizar
    var publicationId = req.params.id;

   //si existe el componente files dentro del req quiere decir que hay un archivo cargando
   if(req.files.image != undefined){
       //el campo que vamos a pasar por post es el campo image
       var file_path = req.files.image.path;
       console.log(file_path);
       //en la variable file_split convertimos tdo el path en un array con el metodo .split
       var file_split = file_path.split('\\');

       //ahora tomamos la ultima posicionq ue es donde se guardo el nombre de la imagen que ira a uploads/users
       var file_name = file_split[2];

       //ahora para validar que sea una imagen debo validar su extension 
       var ext_split = file_name.split('\.')
       var file_ext = ext_split[1];
       
       //si el archivo contiene una extension de tipo de imagen entonces actualiza la imagen del usuario
       if(file_ext == "png" || file_ext == "jpg" || file_ext == "jpeg" || file_ext == "gif"){
           
           //solo el dueño de la publicacion puede subir imagenes en ella
           PublicationModel.find({'user':req.user.sub, '_id':publicationId}).exec((error, publication)=>{
               if(publication.length >= 1){
                   
                    //actualicemos el documento de la publicacion
                    PublicationModel.findById(publicationId, (err, publicationImage)=>{
                        if(err){
                            return res.status(400).json({message:"error en la peticion."});
                        }
                        var pathViejo = "./uploads/publications/"+publicationImage.file;
                        // ====en caso de que ya exista una imagen la borramos ===== //
                        if(fs.existsSync(pathViejo)){
                            fs.unlink(pathViejo)
                        }
                        //guardamos la imagen nueva
                        publicationImage.file = file_name;
                        publicationImage.save((err, publicationImageSave)=>{
                            if(err) return res.status(500).send({message:"Error en la peticion"});
                            return res.status(200).json({publicationImageSave});
                        })   
                    })
               }else{
                return res.status(404).json({message:"no tienes permiso para subir una imagen a esta publicacion"});
               }
           })



       }else{//sino enviar un mensaje que diga no es un tip de archivo valido
           removeFieUploads(res, file_path);
       }
   }else{
       return res.status(400).json({message:"No files were uploaded."});
   }
}

function removeFieUploads(res, file_path, message){
   fs.unlink(file_path, (err)=>{//elimina el archivo subido de la ruta
       return res.status(200).json({message:"Tipo de archivo no valido."});
   }); 
}
//==================================Devolver Imagen de la publicacion ============================//
function getImageFile(req, res){
    var image_file = req.params.imageFile;
    var path_file = './uploads/publications/'+image_file;

    fs.exists(path_file, (exists)=>{
        if(exists){
            return res.sendFile(path.resolve(path_file))
        }else{
            return res.status(200).json({message:"No existe la imagen"});
        }
    })

}

module.exports = {
    probando,
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
}