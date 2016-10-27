
'use strict';

const Hapi = require('hapi');
const Glob = require('glob');
const Path = require('path');
const TokenValidator = require(Path.join(__dirname, '/api/account/helpers/tokenValidator'));

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
                //throw err;
            });
    });
};

internals.init();
