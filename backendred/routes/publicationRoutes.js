'use strict'

var express = require('express');
var PublicationController = require('../controllers/publicationController');

var api = express.Router();


var md_auth = require('../middlewares/autenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/publications'});

//==========================AQUI VAN LOS GET=======================================//

/*probando-*/
api.get('/probandoando', md_auth.ensureAuth, PublicationController.probando);

/*getPublicatios -->trae todas las publicaciones de los usuarios */
api.get('/publications/:page?', md_auth.ensureAuth, PublicationController.getPublications);

/*getPublicatios -->trae una publicacion por su id */
api.get('/publication/:id', md_auth.ensureAuth, PublicationController.getPublication);

/*getimagen de la publication*/
api.get('/get-image-pub/:imageFile', md_auth.ensureAuth, PublicationController.getImageFile );


//==========================AQUI VIENEN LOS POST==================================//

/*upload de la imagen de la publication*/
api.post('/publication-image-pub/:id', [md_auth.ensureAuth, md_upload], PublicationController.uploadImage);


//=========================AQUI VAN LOS DELETE====================================//
/*borrar publicacion*/
api.delete('/delete-publication/:id', md_auth.ensureAuth, PublicationController.deletePublication);





//============================AQUI VAN LOS POST========================================//

/*guardar una publicacion*/
api.post('/save-publication', md_auth.ensureAuth, PublicationController.savePublication);

module.exports = api;