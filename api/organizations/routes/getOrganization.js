'use strict';

//const Boom = require('boom');
const Organization = require('../model/Organization');

const internals = {};

internals.requestHandler = function (request, reply) {

    return reply(Organization.find()
      .then((orgs) => {

          return orgs;
      })
      .catch((err) => {

          throw err;
      }));
};

module.exports = {
    path: '/api/organizations',
    method: 'GET',
    handler: internals.requestHandler
};
