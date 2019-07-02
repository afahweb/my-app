'use strict'

const express=require('express');
const router=express.Router(); //  permite obtener rutas.(crear rutas en el servidor).
const {isAuthenticated} = require('../helpers/auth');


router.get('/', function(req,res){
   res.render('../views/partials/index'); // como respuesta a esta ruta envia este archivo html
});

router.get('/about', function(req,res){
  res.render('../views/partials/about');
});

router.get('/info',isAuthenticated,function(req,res){
   res.render('../views/partials/info');
});

/* router.get('/coments', function(req,res){
   res.render('../views/partials/coments');
}) */
module.exports=router;