'use strict';

const Joi = require('joi');
const Boom = require('boom');
const Organization = require('../model/Organization');
const UpdateOrganizationSchema = require('../validation/updateOrganizationSchema');

const internals = {};

internals.validateObjectId = require('../helpers/validateObjectId');

internals.setFieldsToUpdate = function (fieldName, payload, result) {

    if (payload[fieldName]) {
        result[fieldName] = payload[fieldName];
    }
};

internals.updateOrganizationById = function (id, payload) {

    const fieldsToUpdate = {};

    internals.setFieldsToUpdate('name', payload, fieldsToUpdate);
    internals.setFieldsToUpdate('description', payload, fieldsToUpdate);
    internals.setFieldsToUpdate('code', payload, fieldsToUpdate);
    internals.setFieldsToUpdate('url', payload, fieldsToUpdate);
    internals.setFieldsToUpdate('type', payload, fieldsToUpdate);

    if (fieldsToUpdate.type) {
        fieldsToUpdate.type = fieldsToUpdate.type.toLowerCase();
    }

    return Organization.findByIdAndUpdate(id, {
        $set: fieldsToUpdate
    }, { new: true })
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

    if (!internals.validateObjectId(id)){
        return reply(Boom.badRequest('Must provide a valid organization id'));
    }
    return reply(internals.updateOrganizationById(id, request.payload));
};

module.exports = {
    path: '/api/organizations/{id}',
    method: 'PUT',
    handler: internals.requestHandler,
    config: {
        tags: ['api'],
        description: 'Update',
        notes: 'Updates the specified organization by setting the values of the parameters passed. Any parameters not provided will be left unchanged',
        validate: {
            payload: UpdateOrganizationSchema,
            params: {
                id: Joi.string().description('the organization id')
            },
            headers: Joi.object().keys({
                Authorization: Joi.string()
                                  .description('Authorization token')
                                  .default('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImFkbWluIiwiaWF0IjoxNDc3NjE1MDUwfQ.dBG2q5RCxTdLBwCDC2oVUd_sFcRI5cgmHreLaalBSgM')
            }).unknown()
        }
    }
};
