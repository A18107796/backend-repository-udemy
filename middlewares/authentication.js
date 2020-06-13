var jwt = require('jsonwebtoken');
var seed = require('../config/config').SEED

//Verificar Token
//leer el token, procesarlo, ver si es valido, continuar
exports.verificaToken = function (req, res, next) {

    var token = req.query.token;

    //verificar
    jwt.verify(token, seed, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token no valido!',
                errors: err
            });
        }
        req.usuario = decoded.usuario;
        next();
        /* return res.status(200).json({
                    ok: true,
                    decoded: decoded
                }); */
    });
}




