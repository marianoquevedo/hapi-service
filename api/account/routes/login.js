'use strict';

const JWT = require('jsonwebtoken');
const Path = require('path');
const TokenValidator = require(Path.join(__dirname, '../helpers/tokenValidator'));
const LoginSchema = require(Path.join(__dirname, '../validation/loginSchema'));

const internals = {};

internals.requestHandler = function (request, reply) {

    // fake login credentials
    if (request.payload.username === 'admin' &&
        request.payload.password === '123') {

        const user = {
            id: 1,
            name: 'admin'
        };

        const token = JWT.sign(user, TokenValidator.secret);

        return reply({ token });
    }
    return reply({ message: 'invalid credentials' }).code(401);
};

module.exports = {
    path: '/api/account/login',
    method: 'POST',
    handler: internals.requestHandler,
    config: {
        auth: false,
        description: 'Authentication',
        notes: 'API authentication. Returns a JWT for use in subsequent requests',
        tags: ['api'],
        validate: {
            payload: LoginSchema
        }
    }
};
