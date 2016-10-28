'use strict';

const Joi = require('joi');
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

    console.log('API version', apiVersion);

    return reply(internals.getOrganizations(apiVersion, request.query));
};

module.exports = {
    path: '/api/organizations',
    method: 'GET',
    handler: internals.requestHandler,
    config: {
        tags: ['api'],
        description: 'List all',
        notes: 'List all organizations. Allows filtering by code or name.',
        validate: {
            query: {
                code: Joi.string().description('organization code'),
                name: Joi.string().description('organization name')
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
