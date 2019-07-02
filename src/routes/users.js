 // las rutas de los usuarios , nos permiten tener la forma de resgistrar y salir de la app.
'use strict'

const express = require('express'); // me permite tener un objeto que permite obtener rutas.(crear rutas en el servidor).
const router= express.Router();

const User=require('../models/User'); // ese User es mi modelo de datos.

const passport= require ('passport'); // se requiere ya que passport tiene configurado una estrategia de autenticación y se enceuntra en una función a parte.

router.get('/users/signin', function(req, res){
    res.render('../views/users/signin.hbs');
});

//inicio de sesión
router.post('/users/signin', passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/users/signin',
    failureFlash: true // con esta propiedad del objeto en cuestion permite enviar mensajes de login fallido u ok. 
}));

router.get('/users/signup', function(req,res){
   res.render('../views/users/signup.hbs');
});

//Registro de usuarios
router.post('/users/signup', async function(req,res){
   const {name,email, password, confirm_password} = req.body; 
   const errors = [];
   
 
   if(name.length <=0){
       errors.push({text:'Debe de ingresar su nombre'});
   }
   
   if(email.length <= 0){
       errors.push({text:'Debe de ingresar su e-mail'});
   }

   if(password != confirm_password){
       errors.push({text: 'Ambas contraseñas deben de ser iguales'});
   }

   if(password.length < 8){
       errors.push({text:'La contrsaeña debe de tener al menos 8 caracteres '});
   }

  if(errors.length > 0){
      res.render('../views/users/signup.hbs', {
      errors,
      name,
      email,
      password,
      confirm_password
      });
  }else{
      const emailUser = await User.findOne({email: email});
      if(emailUser){
          req.flash('error_msg', 'Atención , el EMAIL ',email, ' ; ya se encuentra registrado!, verifique su cuenta y vuelva a internarlo.');
          res.redirect('/users/signup');
      }else{
          const newUSer =  new User({name,email,password});
          newUSer.password= await newUSer.encryptPassword(password);
          await newUSer.save();
          req.flash('success_msg', 'Usuario registrado con éxito.!');
          res.redirect('/users/signin');
      }
  }
});

//Cerrar sesión
router.get('/users/logout', function (req,res){
    req.logout();
    res.redirect('/');
});



module.exports = router;