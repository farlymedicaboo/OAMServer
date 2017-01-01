/**
 * Created by kakek on 11/10/16.
 */

var mongoose = require('mongoose');
var posAmbulansSchema = new mongoose.Schema({
    latitude: String,
    longitude: String,
    nama: String,
    alamat: String,
    telepon: String,
    wilayah: String,
    posisi: Object,
    is_pos: Boolean,
    vertex: Array
},{ collection: 'PosAmbulans' });
module.exports = mongoose.model('PosAmbulans', posAmbulansSchema);