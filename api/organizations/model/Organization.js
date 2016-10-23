'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const organizationModel = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = Mongoose.model('Organization', organizationModel);
