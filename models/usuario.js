var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido.'
};

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es requerido.'] },
    email: { type: String, unique: true, required: [true, 'El email es requerido'] },
    password: { type: String, required: [true, 'La contraseña es necesaria.'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
});


usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);