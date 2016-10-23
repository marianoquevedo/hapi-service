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

    console.log('### getAllOrganizations fieldsToReturn', internals.fieldsToReturn);

    return Organization.find({}, internals.fieldsToReturn)
      .then((orgs) => {

          return orgs;
      })
      .catch((err) => {

          throw err;
      });
};

internals.filterOrganizations = function (queryParams) {

    const criteria = [];
    let fieldsToReturn = internals.fieldsToReturn;

    console.log('### filter fieldsToReturn', fieldsToReturn);

    if (queryParams.name) {
        criteria.push({ 'name' : queryParams.name });
    }

    if (queryParams.code) {
        fieldsToReturn = Util._extend({
            url: 1,
            code: 1
        }, internals.fieldsToReturn);

        criteria.push({ 'code' : queryParams.code });
    }

    return Organization
      .find({
          $or : criteria
      }, fieldsToReturn)
      .then((orgs) => {

          return orgs;
      })
      .catch((err) => {

          throw err;
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
