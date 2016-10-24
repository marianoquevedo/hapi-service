'use strict';

const Boom = require('boom');
const Util = require('util');
const Organization = require('../model/Organization');

const internals = {};

internals.validateObjectId = require('../helpers/validateObjectId');

internals.outputKeys = require('../helpers/outputKeys');

internals.getOrganizationById = function (apiVersion, id) {

    let outputKeys = internals.outputKeys;

    // API Version 1 returns all the fields
    if (apiVersion === 1) {
        outputKeys = Util._extend({
            url: 1,
            code: 1
        }, internals.outputKeys);
    }

    return Organization.findById(id, outputKeys)
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
    handler: internals.requestHandler
};
