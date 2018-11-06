'use strict';

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var UserModel = require('../models/userModel');
var FollowModel = require('../models/followModel');
var MessageModel = require('../models/messageModel');
//===================PRUEBA
function pruebaMessage(req, res){
    res.status(200).send({message:"bien esta ok la prueba"});
}

//==================SAVE MESSAGE
function saveMessage(req, res){
    var body = req. body;

    //si hay texto y me llega un reciber entonces continuo
    if(body.text.length > 1 && body.receiber){
        var message = new MessageModel();

        message.emitter = req.user.sub;
        message.receiver = body.receiber;
        message.text = body.text;
        message.created_at = moment().unix();
        message.viewed ='false';

        message.save((error, messageStored)=>{
            if(error) return res.status(500).send('erro en la peticion');
            if(!messageStored) return res.status(404).send('error al enviar el mensaje');

           return res.status(200).send({message:messageStored});
        })
    }else{
        return res.status(200).send({message:'envia los datos necesarios'});
    } 
}
//=====================GET RECEIVER MESSAGE
function getReceiverMessage(req, res){
    var userId = req.user.sub;
    var page = 1;

    if(req.params.page >=1){
        page = req.params.page;
    }
    var itemsPerPage = 4;

    MessageModel.find({receiver:userId})
                .populate('emitter', 'name surname nick image')
                .paginate(page, itemsPerPage, (error, messages, total)=>{
                    if(error) return res.status(500).send('erro en la peticion');
                    if(!messages) return res.status(404).send('no hay mensajes que mostrar');
                    
                    return res.status(200).send({
                        total:total,
                        pages: Math.ceil(total/itemsPerPage),
                        messages

                    });
                });

}
//====================GET EMITT MESSAGE lista los mensajes que he enviado
function getEmmitMessages(req, res){
    var userId = req.user.sub;
    var page = 1;

    if(req.params.page >=1){
        page = req.params.page;
    }
    var itemsPerPage = 4;
    console.log("este es el usuario que hace la consulta", req.user.sub);
    MessageModel.find({emitter:userId})
                .populate('emitter receiver', 'name surname nick image')
                .paginate(page, itemsPerPage, (error, messages, total)=>{
                    if(error) return res.status(500).send('error en la peticion');
                    if(!messages) return res.status(404).send('no hay mensajes que mostrar');
                    
                    return res.status(200).send({
                        total:total,
                        pages: Math.ceil(total/itemsPerPage),
                        messages

                    });
                });
}
//GETUNVIEWEDMESSAGES este metodo muestra el conteo de los mensajes
// que me enviaron pero no he visto es decir los no vistos
function getUnviewedMessages(req, res){
    var userId = req.user.sub;

    MessageModel.count({receiver:userId, viewed:'false'}).exec((error, count)=>{
        if(error) return res.status(500).send('error en la peticion');
        if(!count) return res.status(404).send('no hay mensajes que mostrar');

        return res.status(200).send({
            unviewed:count
        });
    })
}

//SETVIEWEDMESSAGES este metodo cambiara el estado de los mensajes que leemos a leidos
function setViewedMessagess( req, res){
    var userId = req.user.sub;

    MessageModel.update({receiver:userId, viewed:'false'}, {viewed:'true'}, {'multi':true}, (error, messageUpdate)=>{
        if(error) return res.status(500).send('error en la peticion');
        if(!messageUpdate) return res.status(404).send('no hay mensajes que mostrar');

        return res.status(200).send({
            messageUpdate:messageUpdate
        });
    })
}

module.exports ={
    pruebaMessage,
    saveMessage,
    getReceiverMessage,
    getEmmitMessages,
    getUnviewedMessages,
    setViewedMessagess
}