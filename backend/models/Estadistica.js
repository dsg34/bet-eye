/**
 * Created by i_d_a on 01/06/2016.
 */
var mongoose = require('mongoose');

var EstadisticaSchema = new mongoose.Schema({
    usuario: String,
    eventosAcertados: Number, //Eventos de una apuesta que han sido acertados
    eventosApostados: Number, //Cantidad total de eventos que han sido apostados
    porcentajesAcierto: [{proveedor: String, porcentaje: Number}], //Porcentaje de acierto en cada ticket. La media dará el porcentaje medio de acierto del usuario
    apuestasGanadas: Number,
    importeTotal: Number,
    premioTotal: Number
});

module.exports = mongoose.model('Estadistica', EstadisticaSchema);