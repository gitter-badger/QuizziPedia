/*******************************************************************************
* Name: test
* Description: classe che contiene dei tests;
* Creation data: 13-06-2016;
* Author: Matteo Granzotto.
********************************************************************************
* Updates history
* -------------------------------------------------------------------------------
* Update data: 13-06-2016;
* Description: Creata;
* Author: Matteo Granzotto.
*-------------------------------------------------------------------------------
*******************************************************************************/

var app = require('../Server');
var request = require("supertest");
var should = require("should");
var agent = request.agent(app);

describe("Signup Test", function() {
    it("should signup and return a user object", function (done) {
        this.timeout(10000);
        var userJSON = {
            'name': 'Gilberto',
            'surname': 'Filè',
            'email': 'gibbo.file@gmail.com',
            'username': 'gibbo',
            'password': 'ciaociao'
        };
        request(app)
            .post('/api/:lang/signup')
            .send(userJSON)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (!err && res.status == 200) {
                    res.body.message.should.equal("Registrazione avvenuta con successo")
                }
                else
                    res.body.message.should.equal("Registrazione non effettuata");
                done()
            });
    })
});

describe("Signin Test", function () {
    it("should signin and return a user object", function (done) {
        this.timeout(10000);
        agent
            .post('/api/:lang/signin')
            .send({username: 'gibbo', password: 'ciaociao'})
            .end(function (err, res) {
                if (!err && res.status == 200)
                    res.body.user.username.should.equal("gibbo");
                else
                    res.status.should.equal(500);
                done()
            });
    });
});

describe("User Loggedin Test", function () {
    it("should return a user object", function (done) {
        this.timeout(10000);
        agent
            .get('/api/:lang/loggedin')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (!err && res.status == 200) {
                    res.body.should.not.equal(0)
                }
                done()
            });
    });
});

describe("Signout Test", function () {
    it("should signout", function (done) {
        this.timeout(10000);
        agent
            .post('/api/:lang/signout')
            .send({})
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (!err)
                    res.status.should.equal(200);
                done()
            });
    });
});

describe("Signin Test", function () {
    it("should signin and return a user object", function (done) {
        this.timeout(10000);
        agent
            .post('/api/:lang/signin')
            .send({username: 'gibbo', password: 'ciaociao'})
            .end(function (err, res) {
                if (!err && res.status == 200)
                    res.body.user.username.should.equal("gibbo");
                else
                    res.status.should.equal(500);
                done()
            });
    });
});

describe("Delete Test", function() {
    it("should delete user authenticated", function (done) {
        this.timeout(10000);
        agent
            .delete('/api/:lang/user')
            .end(function(err,res){
                if (!err && res.status==200){
                    res.body.message.should.equal("Utente eliminato");
                }
                else
                    res.status.should.equal(500);
                done()
            });
    });
});
