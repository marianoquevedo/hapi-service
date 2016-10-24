'use strict';

const Boom = require('boom');
const Util = require('util');
const Organization = require('../model/Organization');

const internals = {};

internals.outputFields = require('../helpers/outputFields');

internals.getOrganizations = function (apiVersion, queryParams) {

    let query = {};
    let outputFields = internals.outputFields;

    // API Version 1 returns all the fields
    if (apiVersion === 1) {
        outputFields = Util._extend({
            url: 1,
            code: 1
        }, outputFields);
    }

    if (queryParams.name) {
        query = {
            $text : {
                $search : queryParams.name
            }
        };
    }

    if (queryParams.code) {
        outputFields = Util._extend({
            url: 1,
            code: 1
        }, internals.outputFields);

        query = {
            'code': queryParams.code
        };
    }

    return Organization
      .find(query, outputFields)
      .then((orgs) => {

          return orgs;
      })
      .catch((err) => {

          return Boom.badImplementation(err);
      });
};

internals.requestHandler = function (request, reply) {

    const apiVersion = request.pre.apiVersion;

    console.log('apiVersion', apiVersion);

    return reply(internals.getOrganizations(apiVersion, request.query));
};

module.exports = {
    path: '/api/organizations',
    method: 'GET',
    handler: internals.requestHandler
};
