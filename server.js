
'use strict';

const Hapi = require('hapi');
const Mongoose = require('mongoose');
const Glob = require('glob');
const Path = require('path');
const TokenValidator = require(Path.join(__dirname, '/api/helpers/tokenValidator'));

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

internals.connectToDatabase = function () {

    const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/pager';

    // native Node promises
    Mongoose.Promise = global.Promise;

    return Mongoose.connect(dbUrl);
};

internals.registerPlugins = function (server) {

    server.register(require('hapi-auth-jwt2'), (err) => {

        if (err){
            console.log('error registering plugins', err);
        }

        // JWT authentication
        server.auth.strategy('jwt', 'jwt', {
            key: TokenValidator.secret,
            validateFunc: TokenValidator.validate,
            verifyOptions: { algorithms: ['HS256'] }
        });
        server.auth.default('jwt');
    });
};

internals.init = function () {

    const server = new Hapi.Server();
    server.connection({
        port: Number(process.env.PORT || 3000)
    });

    // register routes
    internals.registerRoutes(server);

    // connect to Mongo
    internals.connectToDatabase()
        .then(() =>  {

            // plugin registration
            internals.registerPlugins(server);

            // start the server
            server.start()
                .then(() => {

                    console.log('Server running at:', server.info.uri);
                })
                .catch((err) => {

                    throw err;
                });
        })
        .catch((err) => {

            console.log('Error connecting to the database', err);
            throw err;
        });
};

internals.init();
