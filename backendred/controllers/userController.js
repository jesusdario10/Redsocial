'use strict'

var UserModel = require('../models/userModel');
var PublicationModel = require('../models/publicationModel');
var FollowModel = require('../models/followModel');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var mongossePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');


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
        if(err) res.status(500).send({message:"error al ingresar el usuario"});
        if(user){
            bcrypt.compare(password, user.password, (err, check)=>{
                if(check){
                    //generar y devolver el token que contiene el usuario encriptado con el secret
                    if(body.gettoken){
                        return res.status(200).send({token: jwt.createToken(user)})//le paso el usuario que quiero encriptar
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
//============LISTAR UN USUARIO  Y SABER SI ME SIGUE O YO LO SIGO=======//
function getUser(req, res){
    //el id del usuario me llegara por la URL
    var userId = req.params.id;

    UserModel.findById(userId, (err, user)=>{
        if(err) return res.status(500).send({message:"Error en la peticion"});
        if(!user) return res.status(404).send({message:"usuario no existe"});
        user.password = undefined;
        user.role = undefined;
        //usando el metodo async-away creado
        followThisUser(req.user.sub, userId).then((value)=>{
            return res.status(200).send({
                user, 
                following : value.following,
                followed : value.followed
            })
        }); 
    });
}
//=============FUNCION ASINCRONA PARA SABER SI EL USUARIO AL QUE SIGO ME SIGUE A MI=======//
async function followThisUser(identity_user_id, user_id){
    /*cuando se ejecute algo esperara a que consiga el resultado para continuar
      es decir se convertira en un proceso sincrono*/
      
      //con following se si  estoy siguiendo a alguien
    var following = await FollowModel.findOne({'user':identity_user_id, "followed":user_id}, (error, follow)=>{
                            if(error) return handleError(error);
                            return follow;
                        }); 
      //con followed  se si ese alguien al que estoy siguiendo me sigue
    var followed = await FollowModel.findOne({'user':user_id, "followed":identity_user_id}, (error, follow)=>{
                            if(error) return handleError(error);
                            return followed;
                        });                  
      return  {
         following,
         followed
      }                           
}
//======================LISTAR TODOS LOS USUARIOS PAGINADOS===============================//
function getUsers(req, res){
    //aqui recogeremos el id del usuario que esta logueado que se ha decodificado del token
    //var identity_user_id = req.user.sub; // esta en la propiedad sub porque fue la propiedad que definimos en el jwt
    //page es el numero de pginas que utilizaremos para mostrar los datos
    var page = 1;
    //console.log(req.user);

    if(req.params.page){
        page = req.params.page;
    }
    //cantidad de usuarios que se mostraran por pagina
    var itemsPerPage = 5;
    var identity_user_id = req.user.sub;

    UserModel.find()
            .sort('_id')
            .paginate(page, itemsPerPage, (err, users, total)=>{
                if(err) return res.status(500).send({message:"Error en la peticion"});
                if(!users) return res.status(404).send({message:"no existen usuarios"});

                followUsers(identity_user_id).then((value)=>{
                    return res.status(200).send({
                        users,
                        user_followings : value.followings,
                        user_follow_me  : value.followeds,
                        total,
                        pages : Math.ceil(total/itemsPerPage)
                    });
                });
            });   
}
//=====FUNCION ASINCRONA PARA SABER A QUIENES SEGUIMOS Y QUIENES NOS SIGUEN===========//
async function followUsers(user_id){//los campos con 0 no saldra

    try{
        var followings = await FollowModel.find({"user": user_id}).select({":id":0, '_v':0, 'user':0}).exec()
          .then((follows)=>{
              var follows_clean = [];
              follows.forEach((follow)=>{
                follows_clean.push(follow.followed);
              })
              return follows_clean;
          }).catch((err)=>{
                return handleerror(err); 
              })
        var followeds = await FollowModel.find({"followed": user_id}).select({":id":0, '_v':0, 'followed':0}).exec()
          .then((users)=>{
              var user_clean = [];
                users.forEach((user)=>{
                  user_clean.push(user.user);
              })
              return user_clean;
          }).catch((err)=>{
                return handleerror(err); 
              })  

    }catch(e){
      console.log(e);
    }            
                   
    return {
         followings:followings,
         followeds:followeds
    }                                                               
}

//==============Edicion de Datos de usuario=====================//
function updateUser(req, res){
    //regoge desde la url el id del usuario que vamos a actualizar
    var userId = req.params.id;
    var body = req.body;
    
    //borrar la propiedad password usando el metodo delete
    delete body.password;

    //ahora validemos que solo el mismo usuario pueda actualizar sus datos
    if(userId != req.user.sub){
        return res.status(500).send({message:"no tienes permiso para actualiar los datos del usuario"});
    }
    /*usamos el findByIdAndUpdate el segundo parametro son los datos a actualizar 
      el tercer parametro es opcional para que me devuelva los datos del usuario actualizado*/
    UserModel.findByIdAndUpdate(userId, body, {new:true}, (err, userUpdate)=>{
        if(err) return res.status(500).send({message:"Error en la peticion"});
        if(!userUpdate) return res.status(404).send({message:"no se pudo actualizar el usuario"});
        userUpdate.password = undefined;
        return res.status(200).send({
            message:"usuario Actualizado",
            userUpdate
        });
    })
}

//===============================SUBIR IMAGEN DE AVATAR DE USUARIO===========================//
function uploadImage(req, res){
     //regoge desde la url el id del usuario que vamos a actualizar
     var userId = req.params.id;
    //ahora validemos que solo el mismo usuario pueda actualizar sus datos
    if(userId != req.user.sub){
        return res.status(500).send({message:"no tienes permiso para actualiar los datos del usuario"});
    }
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
            
            //actualicemos la imagen del usuario
            UserModel.findById(userId, (err, userImage)=>{
                if(err){
                    return res.status(400).json({message:"error en la peticion."});
                }
                var pathViejo = "./uploads/users/"+userImage.image;
                // ====en caso de que ya exista una imagen la borramos ===== //
                if(fs.existsSync(pathViejo)){
                    fs.unlink(pathViejo)
                }
                //guardamos la imagen nueva
                userImage.image = file_name;
                userImage.save((err, user)=>{
                    if(err) return res.status(500).send({message:"Error en la peticion"});
                    user.password = undefined;
                    return res.status(200).json({user});
                })   
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

//==================================Devolver Imagen Al usuario============================//
function getImageFile(req, res){
    var image_file = req.params.imageFile;
    var path_file = './uploads/users/'+image_file;

    fs.exists(path_file, (exists)=>{
        if(exists){
            return res.sendFile(path.resolve(path_file))
        }else{
            return res.status(200).json({message:"No existe la imagen"});
        }
    })

}
//====================CONTADOR DE USUARIOS QUE NOS SIGUEN Y LOS QUE SEGUIMOS================//
function getCounters(req, res){
  var user_id = req.user.sub;
  if(req.params.id){
    var user_id = req.params.id;
  }

  getCountFollow(user_id).then((value)=>{
    return res.status(200).send({value});
  })
  
}

//Funcion que me cuenta cuantos seguidores tengo y a cuantos sigo==========
async function getCountFollow(user_id){
  var following = await FollowModel.count({'user': user_id}, (error, count)=>{
    if(error) return handleError(err);
    return count;
  })

  var followed = await FollowModel.count({"followed":user_id}, (error, count)=>{
    if(error) return handleError(err);
    return count;
  })

  //contemos nuestras publications:
  var publications = await PublicationModel.count({"user":user_id}, (error, count)=>{
    if(error) return handleError(err);
    return count;
  })

  return {
    followin: following,
    followed : followed,
    publications :publications
  }
}




module.exports = {
    home,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile,
    getCounters
}