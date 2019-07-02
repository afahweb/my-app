'use strict'

const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProjectSchema = new Schema({
    name: {type:String, required: true},
    description: {type:String, required:true},
    category:{type:String, required:true},
    year:{type:Number, required:true},
    langs:{type:String, required:true},
    date:{type:String, default: Date.now},
    filename:{type:String},
    path:{type:String},
    user:{type:String},
    name_user:{type:String}
});

module.exports = mongoose.model('Project', ProjectSchema);// con esta línea ya tenemos un esquema para guardar proyectos.