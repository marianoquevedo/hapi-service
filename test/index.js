'use strict';

const Code = require('code');
const Lab = require('lab');
const Path = require('path');
const JWT = require('jsonwebtoken');
const Mongoose = require('mongoose');
const TokenValidator = require(Path.join(__dirname, '../api/account/helpers/tokenValidator.js'));
const Organization = require(Path.join(__dirname, '../api/organizations/model/Organization.js'));
const BootstrapServer = require(Path.join(__dirname, 'bootstrap.js'));

const lab = exports.lab = Lab.script();
const expect = Code.expect;

Mongoose.Promise = global.Promise;

lab.experiment('Organizations', () => {

    let server;

    const user = {
        id: 1,
        name: 'admin'
    };

    const authToken = JWT.sign(user, TokenValidator.secret);

    lab.before((done) => {

        BootstrapServer((err, srv) => {

            if (err) {
                throw err;
            }

            server = srv;
            done();
        });
    });

    // Run before every single test
    lab.beforeEach((done) => {

        done();
    });

    lab.after((done) => {

        server.stop(done);
    });

    lab.test('/POST should return saved organization', (done) => {

        const newOrg = {
            name: 'Justice League',
            description: 'A league to fight evil',
            url: 'http://www.justiceleague.com',
            code: 'JLEAGUE',
            type: 'insurance'
        };

        const options = {
            method: 'POST',
            url: '/api/organizations',
            payload: newOrg,
            headers: {
                Authorization: authToken
            }
        };

        server.inject(options, (response) => {

            const result = response.result;

            // validate returned value
            expect(response.statusCode).to.equal(201);
            expect(result.name).to.equal(newOrg.name);
            expect(result.description).to.equal(newOrg.description);
            expect(result.url).to.equal(newOrg.url);
            expect(result.code).to.equal(newOrg.code);
            expect(result.type).to.equal(newOrg.type);

            // validate saved org
            Organization.findById(result.id, (err, savedOrg) => {

                if (err) {
                    throw err;
                }

                expect(savedOrg._id.toString()).to.equal(result.id);
                expect(savedOrg.name).to.equal(result.name);
                expect(savedOrg.description).to.equal(result.description);
                expect(savedOrg.url).to.equal(result.url);
                expect(savedOrg.code).to.equal(result.code);
                expect(savedOrg.type).to.equal(result.type);

                done();
            });
        });
    });

    lab.test('/POST should return 401 if no token is present', (done) => {

        const newOrg = {
            name: 'Justice League',
            description: 'A league to fight evil',
            url: 'http://www.justiceleague.com',
            code: 'JLEAGUE',
            type: 'insurance'
        };

        const options = {
            method: 'POST',
            url: '/api/organizations',
            payload: newOrg
        };

        server.inject(options, (response) => {

            expect(response.statusCode).to.equal(401);
            done();
        });
    });

    lab.test('/POST should return 400 if <name> is not present on payload ', (done) => {

        const newOrg = {
            description: 'A league to fight evil',
            url: 'http://www.justiceleague.com',
            code: 'JLEAGUE',
            type: 'insurance'
        };

        const options = {
            method: 'POST',
            url: '/api/organizations',
            payload: newOrg,
            headers: {
                Authorization: authToken
            }
        };

        server.inject(options, (response) => {

            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    lab.test('/POST should return 400 if <description> is not present on payload ', (done) => {

        const newOrg = {
            name: 'Justice League',
            url: 'http://www.justiceleague.com',
            code: 'JLEAGUE',
            type: 'insurance'
        };

        const options = {
            method: 'POST',
            url: '/api/organizations',
            payload: newOrg,
            headers: {
                Authorization: authToken
            }
        };

        server.inject(options, (response) => {

            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    lab.test('/POST should return 400 if <url> is not present on payload ', (done) => {

        const newOrg = {
            name: 'Justice League',
            description: 'A league to fight evil',
            code: 'JLEAGUE',
            type: 'insurance'
        };

        const options = {
            method: 'POST',
            url: '/api/organizations',
            payload: newOrg,
            headers: {
                Authorization: authToken
            }
        };

        server.inject(options, (response) => {

            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    lab.test('/POST should return 400 if <code> is not present on payload ', (done) => {

        const newOrg = {
            name: 'Justice League',
            description: 'A league to fight evil',
            url: 'http://www.justiceleague.com',
            type: 'insurance'
        };

        const options = {
            method: 'POST',
            url: '/api/organizations',
            payload: newOrg,
            headers: {
                Authorization: authToken
            }
        };

        server.inject(options, (response) => {

            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    lab.test('/POST should return 400 if <type> is not present on payload ', (done) => {

        const newOrg = {
            name: 'Justice League',
            description: 'A league to fight evil',
            url: 'http://www.justiceleague.com',
            code: 'JLEAGUE'
        };

        const options = {
            method: 'POST',
            url: '/api/organizations',
            payload: newOrg,
            headers: {
                Authorization: authToken
            }
        };

        server.inject(options, (response) => {

            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    lab.test('/POST should return 400 if <type> is invalid', (done) => {

        const newOrg = {
            name: 'Justice League',
            description: 'A league to fight evil',
            url: 'http://www.justiceleague.com',
            code: 'JLEAGUE',
            type: 'UNK'
        };

        const options = {
            method: 'POST',
            url: '/api/organizations',
            payload: newOrg,
            headers: {
                Authorization: authToken
            }
        };

        server.inject(options, (response) => {

            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    lab.test('/GET should return array', (done) => {

        const options = {
            method: 'GET',
            url: '/api/organizations',
            headers: {
                Authorization: authToken
            }
        };

        server.inject(options, (response) => {

            const result = response.result;

            expect(response.statusCode).to.equal(200);
            expect(result).to.be.instanceof(Array);

            done();
        });
    });

    lab.test('/GET should return 401 if no token is present', (done) => {

        const options = {
            method: 'GET',
            url: '/api/organizations'
        };

        server.inject(options, (response) => {

            expect(response.statusCode).to.equal(401);
            done();
        });
    });
});

