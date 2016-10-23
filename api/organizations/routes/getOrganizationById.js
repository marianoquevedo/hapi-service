'use strict';

const Boom = require('boom');
const Organization = require('../model/Organization');

const internals = {};

internals.validateObjectId = require('../helpers/validateObjectId');

internals.fieldsToReturn = require('../helpers/fieldsToReturn');

internals.getOrganizationById = function (id) {

    return Organization.findById(id, internals.fieldsToReturn)
      .then((org) => {

          return org;
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
    return reply(internals.getOrganizationById(request.params.id));
};

module.exports = {
    path: '/api/organizations/{id}',
    method: 'GET',
    handler: internals.requestHandler
};
