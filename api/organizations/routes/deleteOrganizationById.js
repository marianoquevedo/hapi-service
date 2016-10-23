'use strict';

const Boom = require('boom');
const Organization = require('../model/Organization');

const internals = {};

internals.validateObjectId = require('../helpers/validateObjectId');

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
    handler: internals.requestHandler
};
