'use strict';

const Boom = require('boom');
const Joi = require('joi');
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
        tags: ['api'],
        description: 'Create',
        notes: 'Saves an organization',
        validate: {
            payload: CreateOrganizationSchema,
            headers: Joi.object().keys({
                Authorization: Joi.string()
                                  .description('Authorization token')
                                  .default('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImFkbWluIiwiaWF0IjoxNDc3NjE1MDUwfQ.dBG2q5RCxTdLBwCDC2oVUd_sFcRI5cgmHreLaalBSgM'),
            }).unknown()
        }
    }
};
