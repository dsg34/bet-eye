/**
 * Created by i_d_a on 02/06/2016.
 */
var express = require('express');
var router = express.Router();

var Usuario = require('../models/Usuario.js');
var bcrypt   = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var jwtCheck = require('express-jwt');
var config = require('../config.js');

//Recibo email y password. Si alguno de los campos no está relleno o el email ya está en uso, devuelvo código de error. En caso contrario, inserto
//el usuario en la BBDD
//Argumentos: email, password
router.post('/registro', function(req, res, next){
    var devuelve;
    if(req.body.email!=null && req.body.email!="") {
        if(req.body.password!=null && req.body.password!="") {
            Usuario.find({email: req.body.email}).exec(function (err, usu) {
                if (err) return next(err);
                if (usu == null || usu.length <= 0) {
                    var usuario = {
                        email: req.body.email,
                        password: generateHash(req.body.password)
                    };
                    Usuario.create(usuario, function (err, post) {
                        if (err) return next(err);
                        var token = crearToken(post);
                        var devuelve = {
                            token: token,
                            email: post.email,
                        }
                        return res.json(devuelve);
                    });
                } else {
                    devuelve = {
                        error: "Ya existe una cuenta asociada al email que has insertado."
                    }
                    return res.json(devuelve);
                }
            })
        }else{
            devuelve = {
                error: "La contraseña no puede estar vacía."
            }
            return res.json(devuelve);
        }
    }else{
        devuelve = {
            error: "Debes enviar un email correcto."
        }
        return res.json(devuelve);
    }
});

//Recibo email y contraseña y devuelvo un objeto con estado true o false, según sea el login, y un token de acceso si el estado es true
//Argumentos: email, password
router.post('/login', function(req, res, next){
    var devuelve;
    if(req.body.email!=null && req.body.email!="") {
        if(req.body.password!=null && req.body.password!="") {
            Usuario.findOne({email: req.body.email}).exec(function (err, usu) {
                if (err) return next(err);
                if (usu == null || usu.length <= 0) {
                    devuelve = {
                        estado: false,
                        error: "No existe ninguna cuenta con dicho email asociado."
                    }
                } else {
                    if (validPassword(req.body.password, usu.password)){
                        devuelve = {
                            estado: true,
                            token: crearToken(usu)
                        }
                    }else{
                        devuelve = {
                            estado: false,
                            error: "La contraseña que has introducido no es correcta."
                        }
                    }
                }
                return res.json(devuelve);
            });
        }else{
            devuelve = {
                estado: false,
                error: "No has indicado ningún contraseña."
            }
            return res.json(devuelve);
        }
    }else{
        devuelve = {
            estado: false,
            error: "No has indicado ningún email."
        }
        return res.json(devuelve);
    }
})

function crearToken(user){
    var token = jwt.sign(
        {
            user: user.name,
        }
        , config.session.secret,
        {
            expiresIn: 24*60*60 // expira en 24 horas (expresado en segundos)
        }
    );

    return token;
}

// Métodos para seguridad de contraseña ======================
// genera un hash
generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

validPassword = function(password, passwordOld) {
    return bcrypt.compareSync(password, passwordOld);
};

module.exports = router;