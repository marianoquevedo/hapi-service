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
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform: function (doc, ret) {
            // remove the _id of every document before returning the result
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

module.exports = Mongoose.model('Organization', organizationModel);
