/**
 * Created by kakek on 11/10/16.
 */

var mongoose = require('mongoose');
var masyarakatSchema = new mongoose.Schema({
    nama_masyarakat: String,
    nomor_hp_masyarakat: String,
    email: String,
    password: String
},{ collection: 'Masyarakat' });
module.exports = mongoose.model('Masyarakat', masyarakatSchema);