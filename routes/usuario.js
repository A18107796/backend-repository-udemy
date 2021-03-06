var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAuthentication = require('../middlewares/authentication');

//Importar esquema de usuarios
var Usuario = require('../models/usuario');


//Inicializar Variables

var app = express();



//Obtener todos los USUARIOS
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al intentar cargar los usuarios',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });
            });

});






//ACTUALIZAR UN NUEVO USUARIO
app.put('/:id', mdAuthentication.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario.',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el ID ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre
        usuario.email = body.email;
        usuario.role = body.role;
        usuario.save((err, usuarioSaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al modificar usuario.',
                    errors: err
                });
            }
            usuarioSaved.password = ':?';

            res.status(200).json({
                ok: true,
                usuario: usuarioSaved
            });
        })

    });

});




//CREAR UN NUEVO USUARIO
app.post('/', mdAuthentication.verificaToken, (req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioSaved,
            usuarioToken: req.usuario
        });
    })


});

//DELETE USUARIO
app.delete('/:id', mdAuthentication.verificaToken, (req, res) => {
    var id = req.params.id
    Usuario.findByIdAndDelete(id, (err, usuarioDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }
        if (!usuarioDeleted) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioDeleted
        });
    })

})


module.exports = app;