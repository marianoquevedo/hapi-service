'use strict';

const Joi = require('joi');
const JWT = require('jsonwebtoken');

const internals = {};

internals.requestHandler = function (request, reply) {

    if (request.payload.username === 'admin' && 
        request.payload.password === '123') {

        const user = {
            id: 1,
            name: 'admin'
        };

        const token = JWT.sign(user, 'SecretPassword123');

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
