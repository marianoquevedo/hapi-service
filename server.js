
'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Glob = require('glob');
const Path = require('path');
const Mongoose = require('mongoose');
const Package = require('./package');
const TokenValidator = require(Path.join(__dirname, '/api/account/util/tokenValidator'));

const internals = {};

internals.registerRoutes = function (server) {
    // Look through the routes in
    // all the subdirectories of API
    // and create a new route for each
    Glob.sync('api/**/routes/*.js', {
        root: __dirname
    })
    .forEach((file) => {

        const route = require(Path.join(__dirname, file));
        server.route(route);
    });
};

internals.init = function () {

    const server = new Hapi.Server();
    server.connection({
        port: Number(process.env.PORT || 3000)
    });

    // mongoose promises
    Mongoose.Promise = global.Promise;

    // register routes
    internals.registerRoutes(server);

    const plugins = [
        {
            register: require('hapi-api-version'),
            options: {
                validVersions: [1, 2],
                defaultVersion: 2,
                vendorName: 'hapiservice'
            }
        },
        {
            register: require('hapi-auth-jwt2')
        },
        {
            register: require('hapi-mongoose-db-connector'),
            options: {
                mongodbUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/hapi-service'
            }
        },
        Inert,
        Vision,
        {
            register: HapiSwagger,
            options: {
                pathPrefixSize: 2,
                basePath: '/api/',
                info: {
                    'title': 'Hapi API Documentation',
                    'version': Package.version
                },
                tags: [{
                    'name': 'account'
                },{
                    'name': 'organizations'
                }]
            }
        }
    ];

    server.register(plugins, (err) => {

        if (err){
            console.log('error registering plugins', err);
        }

        // set JWT as the default auth strategy
        server.auth.strategy('jwt', 'jwt', {
            key: TokenValidator.secret,
            validateFunc: TokenValidator.validate,
            verifyOptions: { algorithms: ['HS256'] }
        });
        server.auth.default('jwt');

        server.start()
            .then(() =>  {

                console.log('Server running at:', server.info.uri);
            })
            .catch((err) => {

                console.log('Error initializing server', err);
            });
    });
};

internals.init();
