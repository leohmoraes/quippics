var frisby = require('frisby');
var async = require('async');
var agent = require('superagent');
var domainV2 = 'http://admin:admin@localhost:8081/api/v2';
var Challenge = require('../../models/challenge.js');

// this normally would be passed into function properly but we need one passed directly
var domainv2 = 'http://admin:admin@localhost:8081/api/v2';
var user1 = {
  username: 'popular123',
  password: '123',
  email: 'popular123@gmail.com',
  uuid: 'a591bde2 720d89d4 086beaa8 43f9b061 a18b36b4 8cd0008a 1f347a5a d844be95',
  tokenTimestamp: Date.now()
};

var user2 = {
  username: 'nerd314',
  password: '314',
  email: 'nerd314@gmail.com',
  uuid: 'a591bde2 720d89d4 086beaa8 43f9b061 a18b36b4 8cd0008a 1f347a5a d844be76',
  tokenTimestamp: Date.now()
};
var user3 = {
  username: 'user3',
  password: 'password',
  email: 'user3@gmail.com',
  uuid: 'a591bde2 720d89d4 086beaa8 43f9b061 a18b36b4 8cd0008a 1f347a5a d844be77',
  tokenTimestamp: Date.now()
};
var challenge1 = {};
var challenge2 = {};
var submission1 = {}; //not widely accepted submission
var submission2 = {}; //great submission
var submission3 = {}; // submission added to test next/prev submission for #85
exports.spec = function(domain, callback){
  jasmine.getEnv().defaultTimeoutInterval = 1000;
  describe("The test environment", function() {
    it("should delete everything in the database", function(done) {
      agent
      .del(domain + "/server")
      .end(function(res){
        expect(res.status).toEqual(200);
        done();
      });
    });
    it("should create a user who is very popular", function(done) {
      agent
      .post(domain + '/register')
      .type('form')
      .attach('image', './tests/specs/images/defaultProfile.png')
      .field('username', user1.username)
      .field('password', user1.password)
      .field('email', user1.email)
      .end(function(err, res){
        expect(res.status).toEqual(200);
        expect(res.body).toBeDefined();
        user1._id = res.body._id;
        done();
      });
    });
    it("should register nerdy", function(done){
      agent
      .post(domain + '/register')
      .type('form')
      .attach('image', './tests/specs/images/defaultProfile.png')
      .field('username', user2.username)
      .field('password', user2.password)
      .field('email', user2.email)
      .end(function(err, res){
        expect(res.status).toEqual(200);
        expect(res.body).toBeDefined();
        user2._id = res.body._id;
        done();
      });
    });
    it("should register generic", function(done){
      agent
      .post(domain + '/register')
      .type('form')
      .attach('image', './tests/specs/images/defaultProfile.png')
      .field('username', user3.username)
      .field('password', user3.password)
      .field('email', user3.email)
      .end(function(err, res){
        expect(res.status).toEqual(200);
        expect(res.body).toBeDefined();
        user3._id = res.body._id;
        done();
      });
    });
    it('should prepare a challenge', function(done){
      // setup challenge
      challenge1 = {
        title: 'Challenge 1 test',
        tags: ['tag1', 'tag2', 'tag3'],
        owner: user1._id,
        privacy: 'private',
        expiration: new Date(2015, 3, 14)
      };
      agent
      .post(domainV2 + "/challenges")
      .send(challenge1)
      .end(function(res){
        expect(res.status).toEqual(200);
        // save the challenge id for future use
        challenge1._id = res.body._id;
        done();
      });
    });
  });
  describe('Submissions', function(){
    it("expect an empty array when user hasn't submitted anything", function(done){
      // when a user has no submission in a challenge it should return an empty array
      agent
      .get(domainV2 + '/challenges/' + challenge1._id + '/users/' + user2._id + '/submissions/page/1')
      .end(function(err, res){
        var challenge = res.body;
        var submissions = challenge.submissions;
        //expect 200 response
        expect(res.status).toEqual(404);
        expect(submissions.length).toEqual(0);
        done();
      });
    });
    it("can be submitted by a User (Nerdy) into challenge 1", function(done){
      agent
      .post(domain + "/challenges/" + challenge1._id + "/submissions")
      .type('form')
      .attach("image", "./tests/specs/images/onepixel.png")
      .field("owner", user2._id)
      .end(function(err, res){
        var submission = res.body;
        //make sure something was returned in the response body
        expect(submission).toBeDefined();
        //make sure the id in the response body was returned
        expect(submission._id).toBeDefined();
        //expect 200 response
        expect(res.status).toEqual(200);
        submission1._id = submission._id;
        //console.log("here is the returned superagent submission");
        //console.log(submission);
        done();
      });
    });
    it("can be submitted by a User (Popular) into challenge 1", function(done){
      agent
      .post(domain + "/challenges/" + challenge1._id + "/submissions")
      .type('form')
      .attach("image", "./tests/specs/images/onepixel.png")
      .field("owner", user1._id)
      .end(function(err, res){
        var submission = res.body;
        //make sure something was returned in the response body
        expect(submission).toBeDefined();
        //make sure the id in the response body was returned
        expect(submission._id).toBeDefined();
        //expect 200 response
        expect(res.status).toEqual(200);
        submission2._id = submission._id;
        //console.log("here is the returned superagent submission");
        //console.log(submission);
        done();
      });
    });
    it("can be submitted again by a User (Nerdy) into challenge 1", function(done){
      // this will make sure that a user can submit multiple submissions gh#104
      agent
      .post(domainV2 + "/challenges/" + challenge1._id + "/submissions")
      .type('form')
      .attach("image", "./tests/specs/images/onepixel.png")
      .field("owner", user2._id)
      .end(function(err, res){
        var submission = res.body;
        //make sure something was returned in the response body
        expect(submission).toBeDefined();
        //make sure the id in the response body was returned
        expect(submission._id).toBeDefined();
        expect(submission.comments).toBeDefined();
        //expect 200 response
        expect(res.status).toEqual(200);
        submission1._id = submission._id;
        //console.log("here is the returned superagent submission");
        //console.log(submission);
        done();
      });
    });
    it("can allow you to get only one of Nerdy (user2) submission", function(done){
      // this will make sure that a user can submit multiple submissions gh#104
      agent
      .get(domainV2 + '/challenges/' + challenge1._id + '/submissions/users/' + user2._id)
      .end(function(err, res){
        var submission = res.body;
        //expect 200 response
        expect(res.status).toEqual(200);
        expect(submission).toBeDefined();
        expect(submission._id).toBeDefined();
        expect(submission.thumbnail).toBeDefined();
        expect(submission.owner).toBeDefined();
        expect(submission.score).toBeDefined();
        expect(submission.rank).toBeDefined();
        expect(submission.image).toBeDefined();
        expect(submission.commentCount).toBeDefined();
        expect(submission.commentCount).toEqual(0);
        done();
      });
    });
    it("can get a list of submissions in a challenge which the user has submitted", function(done){
      // make sure all the user's submissions for a challenge can be returned gh #120
      agent
      .get(domainV2 + '/challenges/' + challenge1._id + '/users/' + user2._id + '/submissions/page/1')
      .end(function(err, res){
        var challenge = res.body;
        var submissions = challenge.submissions;
        //expect 200 response
        expect(res.status).toEqual(200);
        expect(submissions.length).toEqual(2);
        expect(submissions[0].thumbnail).toBeDefined();
        expect(submissions[0]._id).toBeDefined();
        submissions.forEach(function(submission){
          expect(submission.thumbnail).toBeDefined();
          expect(submission.image).toBeDefined();
          expect(submission.owner.username).toBeDefined();
          expect(submission.owner._id).toBeDefined();
          expect(submission.owner._id).toEqual(user2._id);
        });
        done();
      });
    });
  });
  describe('it can move to the next test', function(){
    // we need this here so that it moves to the next test in the specRunner since
    // every test invoked requires a callback
    callback(null);
  });
};
