/**
 * Created by i_d_a on 01/06/2016.
 */
var mongoose = require('mongoose');

var UsuarioSchema = new mongoose.Schema({
    email: {type: String, unique: true},
    password: String,
});

module.exports = mongoose.model('Usuario', UsuarioSchema);