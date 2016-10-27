'use strict';

const Joi = require('joi');
const JWT = require('jsonwebtoken');
const Path = require('path');
const TokenValidator = require(Path.join(__dirname, '../helpers/tokenValidator.js'));

const internals = {};

internals.requestHandler = function (request, reply) {

    // fixed login credentials
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
        validate: {
            payload: Joi.object({
                username: Joi.string().required(),
                password: Joi.string().required()
            })
        }
    }
};
