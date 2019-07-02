'use strict'

const helpers = {};

helpers.isAuthenticated = function(req,res,next){
   if(req.isAuthenticated()){ // esto me devuelve un true o false.
        return next(); // si el usario se ha logueado continua con la siguiente función.
   }
   req.flash('error_msg', 'No está autorizado aún en la APP, primero debe de registrarse o ir al botón  ingresar si ya se encuentra registrado.');
   res.redirect('/users/signup');
}

module.exports = helpers;