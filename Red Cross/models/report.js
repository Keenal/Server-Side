var mongoose = require('mongoose');

var reportSchema = mongoose.Schema({
    uid: String,
    disasterId: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    currentLocation: String,
    status: String,
    message: String,
    date: Date
});

var Report = mongoose.model('Report', reportSchema, 'Reports');
module.exports = Report;