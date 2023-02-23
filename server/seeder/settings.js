var mongoose = require('mongoose');
let Settings = require('../models/Settings');

async function seedSettings() {
    var settings = new Settings({
        paypalClientID: 'AeSMjKG4phjf93lqnwbo58yueyMSPBLGuFQ26xgdU7qkKITkpQN3zxFxcaE5-8eNjuDLXLlEkjGciK8Q',
        paypalClientSecret: 'EAiJ_AIgx9NnvgcOYedfzxS0ixREa07O11yHs317sLPMEVfH5LT4R6SQdPfKq09xPN-Y1zKAXAAz8bRi'
    });

    await settings.save();
    console.log("Settings Saved!");
}


module.exports = seedSettings;