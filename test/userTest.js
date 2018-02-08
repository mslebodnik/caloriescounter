//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const User = require('../model/userModel');

//Require the dev-dependencies
const chai = require('chai');
const app = require('../app');
const should = chai.should();
const expect = chai.expect;
const request = require('supertest');

var users = {
    'admin': {
        'username': 'admin',
        'password': 'admin',
        'role': 'ADMIN'
    },
    'manager': {
        'username': 'manager',
        'password': 'manager',
        'role': 'MANAGER'
    },
    'user': {
        'username': 'user',
        'password': 'user',
        'role': 'USER'
    }
}

function useJWT(token) {
    it('use JWT token', (done) => {
        request(app)
            .get('/api/user')
            .set('Authorization', 'JWT ' + token)
            .expect(200, done);
    })
}

//Our parent block
describe('Users', () => {
    before((done) => { //Before test we empty the database
        User.remove({}, (err) => {
            done();
        });
    });
    /*
      * Test the /GET /api/route
      */
    describe('1. GET Unauthenticated /api/user', () => {
        it('return Unauthorized', (done) => {
            request(app)
                .get('/api/user')
                .expect(401, done);
        });
    });

    Object.keys(users).forEach(key => {
        describe('2. Create User', () => {
            it('it should Create user ' + users[key].username, (done) => {
                request(app)
                    .post('/api/register')
                    .type('json')
                    .send(users[key])
                    .expect(201, done);
            });
        });
        describe('3. Authentification', () => {
            it('with wrong password ' + users[key].username, (done) => {
                request(app)
                    .post('/api/login')
                    .type('json')
                    .send({ "username": users[key].username, "password": "wrong" })
                    .expect(401, done);
            });

            it('with NO password ' + users[key].username, (done) => {
                request(app)
                    .post('/api/login')
                    .type('json')
                    .send({ "username": users[key].username })
                    .expect(401, done);

            });


            it('get JWT token for ' + users[key].username , (done) => {
                request(app)
                    .post('/api/login')
                    .type('json')
                    .send({ "username": users[key].username, "password": users[key].password })
                    .expect(200).end((err, res) => {
                        if(err) done(err);
                        var token=JSON.parse(res.text).token;
                        useJWT(token);
                        done();
                    });
            })
        })
    })
})