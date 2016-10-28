'use strict';

const internals = {};

internals.secret = process.env.JWT_SECRET || 'SecretPassword123';

internals.validate = function (decoded, request, callback) {

    // check if the user is valid, expiration date, etc
    if (decoded.id === 1) {
        return callback(null, true);
    }

    // invalid user
    return callback(null, false);
};

module.exports = {
    secret: internals.secret,
    validate: internals.validate
};

