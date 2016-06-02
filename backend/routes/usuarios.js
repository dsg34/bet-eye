var express = require('express');
var router = express.Router();

var Usuario = require('../models/Usuario.js');
var bcrypt   = require('bcrypt-nodejs');


///////////////Operaciones básicas/////////////////

/* GET users listing. */
router.get('/', function(req, res, next) {
    Usuario.find(function (err, usuarios) {
        if (err) return next(err);
        res.json(usuarios);
    });
});

/* POST /usuarios */
router.post('/', /*compruebaScopes(['simple']),*/function(req, res, next) {
    Usuario.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* PUT /usuarios/:id */
router.put('/:id', function(req, res, next) {
    Usuario.findById(req.params.id, function (err, post) {
        if (err) return next(err);

        if(req.body.email)
            post.email = req.body.email;

        if(req.body.password)
            post.password = generateHash(req.body.password);

        post.save(function(err){
            if(err) {
                res.send(err);
            }else {
                res.json(post);
            }
        });
    });
});

/* DELETE /usuarios/:id */
router.delete('/:id', /*compruebaScopes(['simple']),*/function(req, res, next) {
    Usuario.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

//////////Operaciones complejas//////////////////////////

//Recibe id (en la url), email y/o password y password2 (por post) y, si password2 coincide con la contraseña antigua, modifica el email y/o la password
//Argumentos: email, password, password2
router.put('/editar/:id', function(req, res, next) {
    Usuario.findById(req.params.id, function (err, post) {
        if (err) return next(err);

        if(generateHash(req.body.password2)!=post.password)
            return next(err);

        if(req.body.email)
            post.email = req.body.email;

        if(req.body.password)
            post.password = generateHash(req.body.password);

        post.save(function(err){
            if(err) {
                res.send(err);
            }else {
                res.json(post);
            }
        });
    });
});

// Métodos para seguridad de contraseña ======================
// genera un hash
generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Comprueba que la contraseña es correcta
validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = router;
