'use strict';

const ObjectId = require('mongoose').Types.ObjectId;

module.exports = function (id) {

    try {
        return ObjectId.isValid(ObjectId.createFromHexString(id));
    }
    catch (e) {
    };
};
