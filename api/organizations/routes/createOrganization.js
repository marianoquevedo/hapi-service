'use strict';

const Boom = require('boom');
const Organization = require('../model/Organization');
const CreateOrganizationSchema = require('../validation/createOrganizationSchema');

const internals = {};

internals.requestHandler = function (request, reply) {

    const organization = new Organization();
    organization.name = request.payload.name;
    organization.description = request.payload.description;

    return reply(organization.save()
      .then((createdOrganization) => {

          return createdOrganization;
      })
      .catch((err) => {

          throw Boom.badRequest(err);
      }));
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
