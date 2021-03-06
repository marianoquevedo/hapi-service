'use strict';

const CreateOrganizationSchema = require('../validation/createOrganizationSchema');

const internals = {};

// mark fields as optional to allow partial updates
internals.updateOrganizationSchema = CreateOrganizationSchema.optionalKeys([
    'name', 'description', 'url', 'code', 'type']);

module.exports = internals.updateOrganizationSchema;
