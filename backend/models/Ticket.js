/**
 * Created by i_d_a on 01/06/2016.
 */
var mongoose = require('mongoose');

var subSchemaEvento = mongoose.Schema({
        //Atributos obligatorios de captar
        equipo1: String,
        equipo2: String,
        marcadorEquipo1: Number,
        marcadorEquipo2: Number,
        importe: number,
        premio: Number,
        texto: String, // Contiene el texto original del evento

        //Atributos opcionales
        deporte: String,
        tipoApuesta: String,
        ganador: Number,            //0, empate; 1, gana el local; 2, gana el visitante
        fecha: Date

    }
    ,{ _id : false });

var TicketSchema = new mongoose.Schema({
    fecha: {type: Date, default: Date.now},
    eventos: [subSchemaEvento],
    name: String,
    proveedor: String,
    porcentajeAcierto: Number
});

module.exports = mongoose.model('Ticket', TicketSchema);