'use strict';

module.exports.validate = function (decoded, request, callback) {

    // check if the user is valid
    console.log('validate JWT', decoded);

    if (decoded.id === 1) {
        return callback(null, true);
    }

    // invalid user
    return callback(null, false);
};
