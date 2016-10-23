'use strict';

const Joi = require('joi');

const internals = {};

internals.validTypes = ['employer', 'insurance', 'health system'];

internals.createOrganizationSchema = Joi.object({
    name: Joi.string().min(2).max(120).required(),
    description: Joi.string().min(2).max(400).required(),
    url: Joi.string().uri().required(),
    code: Joi.string().alphanum().required(),
    type: Joi.string().valid(internals.validTypes).insensitive().required()
});

module.exports = internals.createOrganizationSchema;
