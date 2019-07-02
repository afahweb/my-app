    'use strict'

const mongoose=require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/my-app-db', { // objeto configuracion de mongo para que no genere errores al guardar, modifcar, actualizar etc.
    useCreateIndex:true, 
    useNewUrlParser:true,
    useFindAndModify:false
}).then(()=>{
    console.log("Conexión a mongoDB ok!...");
});