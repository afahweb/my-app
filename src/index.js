'use strict'

const express= require('express');
const path=require('path');
const exphbs= require('express-handlebars');
const methodOverride= require('method-override');
const session=require('express-session');
const flash= require('connect-flash');
const passport= require('passport');
const morgan = require('morgan');
/* const {format} = require('timeago.js'); */  // formatea un texto y se utiliza en las variables globales.


//Initializations
const app=express();
require('./databases');
require('./config/passport');


//Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname,'views'));// le decimos a node donde está la carpeta wiews gracias al metodo join que tiene una constante _dirname y lo concatena con la carpeta

//preparación de las vistas
app.engine('.hbs', exphbs({
   defaultLayout:'main',
   layoutsDir:path.join(app.get('views'), 'layouts'),
   partialsDir:path.join(app.get('views'),'partials'),
   extname:'.hbs'
}));
app.set('view engine','.hbs');

//Middlewares
app.use(express.urlencoded({extended:false}));//linea de código que permite al servidor entender los datos enviados por un formulario del lado del cliente.
app.use(methodOverride('_method'));// sirve para que el formulario pueda enviar otros tipos de metodos, como put o delete manejados en los formularios de la vista.  
//está configuración permite manejar usuarios las sesiones de usuarios.
app.use(session({
  secret:'mysecretapp',
  resave:true,
  saveUninitialized:true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // se pone despues de las configuraciones anteriores para el manejo de los mensajes.
app.use(morgan('dev'));

//Globals variables
app.use(function(req,res, next){
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error = req.flash('error');
   res.locals.user=req.user || null;
   /* app.locals.format = format; */  // con esto ya podemos utilizarlo desde la vista hbs.
   
   next();
});


//Routes
app.use(require('./routes'));
app.use(require('./routes/coments'));
app.use(require('./routes/sheets'));
app.use(require('./routes/projects'));
/*app.use(require('/routes/notes'));*/
app.use(require('./routes/users'));  



//Static files
app.use(express.static(path.join(__dirname, 'public')));



//Start server listennig
app.listen(app.get('port'), function(){
  console.log('Server on port... ', app.get('port'));
});