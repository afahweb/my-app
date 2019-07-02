'use strict'

const mongoose= require('mongoose');

const { Schema } = mongoose;

const ComentSchema = new Schema({
    coment: {type:String, required:true},
    date:{type:Date, default: Date.now},
    user:{type:String},
    name:{type:String}
    /* user:{type:String} */  // propiedad para guardar comentarios realacionados a cada usuario.

});

module.exports = mongoose.model('Coment', ComentSchema); // con esta linea ya tenemos un esquema para almacenar comentarios.