'use strict';

const Joi = require('joi');

const internals = {};

internals.loginSchema = Joi.object({
    username:
         Joi.string()
            .required()
            .example('admin')
            .default('admin')
            .description('user name'),
    password:
        Joi.string()
            .required()
            .example('123')
            .default('123')
            .description('user password')
}).label('Credentials');

module.exports = internals.loginSchema;
