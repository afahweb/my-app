'use strict'

const mongoose = require ('mongoose');

const { Schema } = mongoose;

const SheetSchema = new Schema({
    name:{type:String, required:true},
    data:{type:String, required:true},
    profile:{type:String, required: true},
    studies:{type:String, required:true},
    experience:{type:String, required:true},
    reference:{type:String, required:true},
    date:{type:String, default: Date.now},
    user:{type:String}
});

module.exports = mongoose.model('Sheet',SheetSchema); // con esta línea ya tenemos un esquema para guardar curriculum