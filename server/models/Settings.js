var mongoose = require('mongoose');

let SettingsSchema = new mongoose.Schema({
    paypalClientID: {
        type: String,
    },
    paypalClientSecret: {
        type: String,
    }
});

module.exports = mongoose.model('Settings', SettingsSchema);