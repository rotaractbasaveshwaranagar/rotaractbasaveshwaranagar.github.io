var expect  = require('chai').expect;
var request = require('request');

describe('Starting server for testing', function() {
    var server;
    this.beforeEach(function() {
        server = require('../server');
    });
    this.afterEach(function() {
        server.close();
    });
    
    it('Main page content', function(done) {
        request('http://0.0.0.0:8080/echo/test' , function(error, response, body) {
            expect(body).to.equal('test');
            done();
        });
    });
});