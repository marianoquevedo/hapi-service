'use strict';

const Joi = require('joi');
const Boom = require('boom');
const Organization = require('../model/Organization');

const internals = {};

internals.validateObjectId = require('../util/validateObjectId');

internals.deleteOrganizationById = function (id) {

    return Organization.findByIdAndRemove(id)
      .then((org) => {

          if (org === null) {
              return Boom.notFound();
          }
          return null;
      })
      .catch((err) => {

          return Boom.badImplementation(err);
      });
};

internals.requestHandler = function (request, reply) {

    const id = request.params.id;

    if (!internals.validateObjectId(id)){
        return reply(Boom.badRequest('Must provide a valid organization id'));
    }
    return reply(internals.deleteOrganizationById(id)).code(204);
};

module.exports = {
    path: '/api/organizations/{id}',
    method: 'DELETE',
    handler: internals.requestHandler,
    config: {
        tags: ['api'],
        description: 'Delete',
        notes: 'Deletes a organization.',
        validate: {
            params: {
                id: Joi.string()
                       .description('the organization id')
            },
            headers: Joi.object().keys({
                Authorization: Joi.string()
                                  .description('Authorization token')
                                  .default('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImFkbWluIiwiaWF0IjoxNDc3NjI1MTU3fQ.ISQczg3OclurcE981oNuZVviVkhUZusAgO3uc3l0ExI'),
            }).unknown()
        }
    }
};
