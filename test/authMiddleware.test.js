const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../server.js'); 

chai.use(chaiHttp);
const expect = chai.expect;

describe('ensureAuthenticated Middleware', () => {
    it('should return 401 if user is not authenticated', (done) => {
        chai.request(app)
            .get('/recommended-items') 
            .end((err, res) => {
                expect(res).to.have.status(401);
                done();
            });
    });
});