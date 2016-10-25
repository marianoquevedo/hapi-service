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
        enum: ['employer', 'insurance', 'health system'],
        required: true
    }
}, {
    toJSON: {
        transform: function (doc, ret) {
            // rename the _id field of every document
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

organizationModel.index({ name: 'text' });

module.exports = Mongoose.model('Organization', organizationModel);
