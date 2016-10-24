'use strict';

const Boom = require('boom');
const Organization = require('../model/Organization');
const CreateOrganizationSchema = require('../validation/createOrganizationSchema');

const internals = {};

internals.requestHandler = function (request, reply) {

    const organization = new Organization();
    organization.name = request.payload.name;
    organization.description = request.payload.description;
    organization.url = request.payload.url;
    organization.code = request.payload.code;
    organization.type = request.payload.type.toLowerCase();

    return reply(organization.save()
      .then((createdOrganization) => {

          return createdOrganization;
      })
      .catch((err) => {

          return Boom.badImplementation(err);
      })).code(201);
};

module.exports = {
    path: '/api/organizations',
    method: 'POST',
    handler: internals.requestHandler,
    config: {
        validate: {
            payload: CreateOrganizationSchema
        }
    }
};
