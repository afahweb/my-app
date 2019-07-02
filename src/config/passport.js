'use strict'

const passport = require('passport'); //este módulo de express permite crear sesiones en el servidor y autenticar con google,facebook, twitter o directamente en la base de datos.
const LocalStrategy = require('passport-local').Strategy;

const User= require('../models/User');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async function(email, password, done){
    
    const user = await User.findOne({email:email});
    if(!user){
        return done(null, false, {message:'No se encontró usuario.!'});
    }else{
        const match = await user.matchPassword(password);
        if(match){
            return done(null,user);
        }else{
            return done(null,false, {message:'Password incorrecto.!'});
        }
    }
   
}));

// si el ususario ingresa se almacena en sesión su id.
passport.serializeUser(function (user, done){
    done(null, user.id);
});

// proceso inverso para manejar los datos de usuario.
passport.deserializeUser(function(id, done){
   User.findById(id, function(err,user){
        done(err,user);
   });
});