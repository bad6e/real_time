'use strict';
var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var server = require('../server.js');

describe('server.js', function () {
  it('GET "/" should return a 200 response', function (done) {
    request(server)
      .get('/')
      .expect(200, done);
  });

  it('GET "/badroute" should return a 404 response', function (done) {
    request(server)
      .get('/badroute')
      .expect(404, done);
  });

  it('should give a 404 on random routes', function (done) {
    request(server)
      .get('/this/is/a/random/routes')
      .expect(404, done);
  });

  it('should give you a 404 if you try to post to random routes', function (done) {
    request(server)
      .post('/this/is/a/random/route')
      .expect(404, done);
  });

  it('should create a poll and redirect upon sucessful post', function (done) {
    request(server)
      .post('/')
      .type('form')
      .send( { items: ['A', 'B'] } )
      .end(function(error, response){
        expect(response.header['location']).to.include('/admin/');
        done();
      })
  });
});

