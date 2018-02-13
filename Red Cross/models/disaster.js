var mongoose = require('mongoose');

var disasterSchema = mongoose.Schema({
    did: String,
    name: String
});

var Disaster = mongoose.model('Disaster', disasterSchema, 'Disasters');
module.exports = Disaster;