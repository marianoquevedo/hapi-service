'use strict';

const Joi = require('joi');
const Boom = require('boom');
const Util = require('util');
const Organization = require('../model/Organization');

const internals = {};

internals.validateObjectId = require('../helpers/validateObjectId');

internals.outputFields = require('../helpers/outputFields');

internals.getOrganizationById = function (apiVersion, id) {

    let outputFields = internals.outputFields;

    // API Version 1 returns all the fields
    if (apiVersion === 1) {
        outputFields = Util._extend({
            url: 1,
            code: 1
        }, internals.outputFields);
    }

    return Organization.findById(id, outputFields)
      .then((org) => {

          if (org === null) {
              return Boom.notFound();
          }
          return org;
      })
      .catch((err) => {

          return Boom.badImplementation(err);
      });
};

internals.requestHandler = function (request, reply) {

    const id = request.params.id;
    const apiVersion = request.pre.apiVersion;

    if (!internals.validateObjectId(id)){
        return reply(Boom.badRequest('Must provide a valid organization id'));
    }
    return reply(internals.getOrganizationById(apiVersion, request.params.id));
};

module.exports = {
    path: '/api/organizations/{id}',
    method: 'GET',
    handler: internals.requestHandler,
    config: {
        tags: ['api'],
        description: 'Retrieve',
        notes: 'Retrieves the details of an existing organization. You need to supply the unique organization identifier that was returned upon creation.',
        validate: {
            params: {
                id: Joi.string().description('the organization id')
            },
            headers: Joi.object().keys({
                Authorization: Joi.string()
                                  .description('Authorization token')
                                  .default('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImFkbWluIiwiaWF0IjoxNDc3NjE1MDUwfQ.dBG2q5RCxTdLBwCDC2oVUd_sFcRI5cgmHreLaalBSgM'),

                accept: Joi.string()
                           .description('API version')
                           .valid(['application/json', 'application/vnd.hapiservice.v1+json', 'application/vnd.hapiservice.v2+json'])
                           .default('application/vnd.hapiservice.v2+json')
            }).unknown()
        }
    }
};
