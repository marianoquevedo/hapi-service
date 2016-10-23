'use strict';

const Util = require('util');
const Organization = require('../model/Organization');

const internals = {};

internals.fieldsToReturn = {
    name: 1,
    description: 1,
    type: 1
};

internals.getAllOrganizations = function () {

    return Organization.find({}, internals.fieldsToReturn)
      .then((orgs) => {

          return orgs;
      })
      .catch((err) => {

          return Boom.badImplementation(err);
      });
};

internals.filterOrganizations = function (queryParams) {

    let query = {};
    let fieldsToReturn = internals.fieldsToReturn;

    if (queryParams.name) {
        // 
        query = {
            $text : {
                $search : queryParams.name
            }
        };
    }

    if (queryParams.code) {
        fieldsToReturn = Util._extend({
            url: 1,
            code: 1
        }, internals.fieldsToReturn);

        query = {
            'code': queryParams.code
        };
    }

    return Organization
      .find(query, fieldsToReturn)
      .then((orgs) => {

          return orgs;
      })
      .catch((err) => {

          return Boom.badImplementation(err);
      });
};

internals.requestHandler = function (request, reply) {

    if (request.query.name || request.query.code) {
        return reply(internals.filterOrganizations(request.query));
    }

    return reply(internals.getAllOrganizations());
};

module.exports = {
    path: '/api/organizations',
    method: 'GET',
    handler: internals.requestHandler
};
