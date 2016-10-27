'use strict';

const Code = require('code');
const Lab = require('lab');
const Path = require('path');
const BootstrapServer = require(Path.join(__dirname, 'bootstrap.js'));

const lab = exports.lab = Lab.script();
const expect = Code.expect;

lab.experiment('Account', () => {

    let server;

    lab.before((done) => {

        BootstrapServer((err, srv) => {

            if (err) {
                throw err;
            }

            server = srv;
            done();
        });
    });

    lab.test('/POST login with valid credentials should return authentication token', (done) => {

        const credentials = {
            username: 'admin',
            password: '123'
        };

        const options = {
            method: 'POST',
            url: '/api/account/login',
            payload: credentials
        };

        server.inject(options, (response) => {

            const result = response.result;

            // validate returned value
            expect(response.statusCode).to.equal(200);
            expect(result.token).not.to.be.undefined();

            done();
        });
    });

    lab.test('/POST login without valid credentials should return 401', (done) => {

        const credentials = {
            username: 'admin',
            password: 'myInvalidPassword'
        };

        const options = {
            method: 'POST',
            url: '/api/account/login',
            payload: credentials
        };

        server.inject(options, (response) => {

            expect(response.statusCode).to.equal(401);
            done();
        });
    });
});

