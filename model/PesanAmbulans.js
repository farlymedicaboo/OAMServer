/**
 * Created by kakek on 11/10/16.
 */

var mongoose = require('mongoose');  
var pesanAmbulansSchema = new mongoose.Schema({  
  latitude: String,
  longitude: String,
  alamat_masyarakat: String,
  patokan_alamat: String,
  keterangan: String,
  tanggal: String,
  status: String,
  masyarakatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Masyarakat' }
},{ collection: 'PesanAmbulans' });
module.exports = mongoose.model('PesanAmbulans', pesanAmbulansSchema);