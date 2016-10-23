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
    },
    url: {
        type: String,
        required: true
    },
    code: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    }
});

module.exports = Mongoose.model('Organization', organizationModel);
