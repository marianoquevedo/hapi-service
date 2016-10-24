'use strict';

const Boom = require('boom');
const Util = require('util');
const Organization = require('../model/Organization');

const internals = {};

internals.outputKeys = require('../helpers/outputKeys');

internals.getAllOrganizations = function (apiVersion) {

    let outputKeys = internals.outputKeys;

    // API Version 1 returns all the fields
    if (apiVersion === 1) {
        outputKeys = Util._extend({
            url: 1,
            code: 1
        }, outputKeys);
    }

    return Organization.find({}, outputKeys)
      .then((orgs) => {

          return orgs;
      })
      .catch((err) => {

          return Boom.badImplementation(err);
      });
};

internals.filterOrganizations = function (apiVersion, queryParams) {

    let query = {};
    let outputKeys = internals.outputKeys;

    // API Version 1 returns all the fields
    if (apiVersion === 1) {
        outputKeys = Util._extend({
            url: 1,
            code: 1
        }, outputKeys);
    }

    if (queryParams.name) {
        query = {
            $text : {
                $search : queryParams.name
            }
        };
    }

    if (queryParams.code) {
        outputKeys = Util._extend({
            url: 1,
            code: 1
        }, internals.outputKeys);

        query = {
            'code': queryParams.code
        };
    }

    return Organization
      .find(query, outputKeys)
      .then((orgs) => {

          return orgs;
      })
      .catch((err) => {

          return Boom.badImplementation(err);
      });
};

internals.requestHandler = function (request, reply) {

    const apiVersion = request.pre.apiVersion;

    if (request.query.name || request.query.code) {
        return reply(internals.filterOrganizations(apiVersion, request.query));
    }

    return reply(internals.getAllOrganizations(apiVersion));
};

module.exports = {
    path: '/api/organizations',
    method: 'GET',
    handler: internals.requestHandler
};
