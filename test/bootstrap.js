'use strict';

const Hapi = require('hapi');
const Glob = require('glob');
const Path = require('path');
const TokenValidator = require(Path.join(__dirname, '../api/account/helpers/tokenValidator.js'));

module.exports = (callback) => {

    const server = new Hapi.Server();
    server.connection({
        port: 3001
    });

    // register routes
    const rootPath = Path.join(__dirname, '../');
    Glob.sync('api/**/routes/*.js', {
        root: rootPath
    })
    .forEach((file) => {
        
        const route = require(Path.join(rootPath, file));
        server.route(route);
    });

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
                mongodbUrl: 'mongodb://localhost:27017/hapi-service-test'
            }
        }
    ];

    server.register(plugins).then(() => {

        // set JWT as the default auth strategy
        server.auth.strategy('jwt', 'jwt', {
            key: TokenValidator.secret,
            validateFunc: TokenValidator.validate,
            verifyOptions: { algorithms: ['HS256'] }
        });
        server.auth.default('jwt');

        return callback(null, server);
    })
    .catch((err) => {
        callback(err);
    });
};
