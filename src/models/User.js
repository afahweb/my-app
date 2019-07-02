const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const {Schema} = mongoose;

const UserSchema = new Schema({
    name: {type:String, required:true},
    email: {type:String, required:true},
    password:{type:String, required:true},
    date:{type:Date,default: Date.now}
});

// Metodo para encriptar la contraseña del usuario. (es indispensable este metodo para el cifrado)
UserSchema.methods.encryptPassword = async function(password){
    const salt = await bcrypt.genSalt(2);
    const hash= bcrypt.hash(password, salt);

    return hash;
};

// Metodo para comparar el cifrado de las contraseñas cuando el usuario se esta ingresando a la app con la contraseña almacenada en la base de datos..
UserSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);// con esta línea ya tenemos un esquema para almacenar usuarios.