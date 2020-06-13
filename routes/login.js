var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var seed = require('../config/config').SEED
//Importar esquema de usuarios
var Usuario = require('../models/usuario');
const usuario = require('../models/usuario');

//Inicializar Variables
var app = express();

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario.',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales Incorrectas = email. asd',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales Incorrectas = password.',
                errors: err
            });
        }
        //Crear el token!!!
        usuarioDB.password = ':)';
        var token = jwt.sign({ usuario: usuarioDB }, seed, { expiresIn: 14400 })



        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id

        });
    })

})



module.exports = app;