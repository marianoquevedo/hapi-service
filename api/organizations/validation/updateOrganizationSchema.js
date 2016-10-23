'use strict';

const Joi = require('joi');

const internals = {};

internals.validTypes = ['employer', 'insurance', 'health system'];

internals.updateOrganizationSchema = Joi.object({
    name: Joi.string().min(2).max(120),
    description: Joi.string().min(2).max(400),
    url: Joi.string().uri(),
    code: Joi.string().alphanum(),
    type: Joi.string().valid(internals.validTypes).insensitive()
});

module.exports = internals.updateOrganizationSchema;
