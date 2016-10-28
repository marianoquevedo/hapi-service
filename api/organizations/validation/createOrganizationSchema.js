'use strict';

const Joi = require('joi');

const internals = {};

internals.validTypes = ['employer', 'insurance', 'health system'];

internals.createOrganizationSchema = Joi.object({
    name:
        Joi.string()
           .min(2)
           .max(120)
           .required()
           .description('Organization name')
           .example('Doge weather')
           .default('Doge weather'),

    description:
        Joi.string()
           .min(2)
           .max(400)
           .required()
           .description('A brief description of the organization')
           .example('The Doge organization')
           .default('The Doge organization'),

    url:
        Joi.string()
           .uri()
           .required()
           .description('The website of the organization')
           .example('http://dogeweather.com/')
           .default('http://dogeweather.com/'),

    code:
        Joi.string()
           .alphanum()
           .required()
           .description('Organization alphanumeric code')
           .example('DOGE997')
           .default('DOGE997'),

    type:
        Joi.string()
           .valid(internals.validTypes)
           .required()
           .description('Organization type [employer, insurance, health system]')
           .example('employer')
           .default('employer')
}).label('Organization');

module.exports = internals.createOrganizationSchema;
