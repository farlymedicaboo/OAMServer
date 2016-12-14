/**
 * Created by kakek on 11/10/16.
 */

var mongoose = require('mongoose');
var adminAmbulansSchema = new mongoose.Schema({
    username: String,
    password: String
},{ collection: 'AdminAmbulans' });
module.exports = mongoose.model('AdminAmbulans', adminAmbulansSchema);