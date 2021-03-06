var frisby = require('frisby');
var superagent = require('superagent');
var async = require('async');
var Challenge = require('../../models/challenge.js');
var domainV2 = 'http://admin:admin@localhost:8081/api/v2';

var user1 = {
  username: 'popular123',
  password: '123',
  email: 'popular123@gmail.com'
};

var user2 = {
  username: 'nerd314',
  password: '314',
  email: 'nerd314@gmail.com'
};
var user3 = {
  username: 'user3',
  password: 'password',
  email: 'user3@gmail.com'
};
var user4 = {
  username: 'nerdy',
  password: 'password',
  email: 'nerdy@gmail.com'
};
var challenge1 = {};
var challenge2 = {};
var challenge3 = {};
var challenge4 = {};
var challenge5 = {};

var submission1 = {};
var submission2 = {};

exports.spec = function(domain, callback){
  jasmine.getEnv().defaultTimeoutInterval = 1000;
  async.series([
    function(cb){
      console.log("Starting the tests");
      cb(null);
    },
    function(cb){
      frisby
      .create("Delete the database")
      .delete(domain + "/server")
      .expectStatus(200)
      .afterJSON(function(){
        console.log("Done deleting db");
        cb(null);
      })
      .toss();
    },
    function(cb){
      describe("Register User", function(){
        it("should register popular", function(done){
          superagent
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
            cb(null);
          });
        });
      });
    },
    function(cb){
      describe("Register User", function(){
        it("should register nerdy", function(done){
          superagent
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
            cb(null);
          });
        });
      });
    },
    function(cb){
      describe("Register User", function(){
        it("should register generic", function(done){
          superagent
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
            cb(null);
          });
        });
      });
    },
    function(cb){
      describe("Register User", function(){
        it("should register another nerdy user", function(done){
          superagent
          .post(domain + '/register')
          .type('form')
          .attach('image', './tests/specs/images/defaultProfile.png')
          .field('username', user4.username)
          .field('password', user4.password)
          .field('email', user4.email)
          .end(function(err, res){
            expect(res.status).toEqual(200);
            expect(res.body).toBeDefined();
            user4._id = res.body._id;
            done();
            cb(null);
          });
        });
      });
    },
    function(cb){
      //setup our challenge
      challenge1 = {
        title: 'Challenge1 Title',
        description: 'Challenge1 Description',
        tags: ['tag1', 'tag2', 'tag3'],
        owner: user1._id,
        privacy: 'private',
        expiration: (new Date()).setMonth(new Date().getMonth()+1),
        invites: [user2._id, user3._id]
      };
      frisby
      .create("Have that user create a challenge")
      .post(domainV2 + '/challenges', challenge1)
      .expectStatus(200)
      .afterJSON(function(challenge){
        expect(challenge._id).toBeDefined();
        challenge1._id = challenge._id;
        cb(null);
      })
      .toss();
    },
    function(cb){
      // check the challenge has the correct number of participants
      describe("A challenge", function(){
        it("has correct number of participants", function(done){
          Challenge
          .findOne({_id: challenge1._id})
          .exec(function(err, challenge){
            console.log(challenge);
            expect(challenge.numParticipants).toEqual(3);
            cb(null);
            done();
          });
        });
      });
    },
    function(cb){
      //have user1 submit into the challenge
      describe("A Submission", function(){
        it("can be submitted by a User1 into challenge 1", function(done){
          superagent
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
            submission1._id = submission._id;
            //console.log("here is the returned superagent submission");
            //console.log(submission);
            cb(null);
            done();
          });
        });
      });
    },
    function(cb){
      //have user2 submit into the challenge
      describe("A Submission", function(){
        it("can be submitted by a User2 into challenge 1", function(done){
          superagent
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
            submission2._id = submission._id;
            //console.log("here is the returned superagent submission");
            //console.log(submission);
            cb(null);
            done();
          });
        });
      });
    },
    function(cb){
      frisby
      .create("Get all the challenges for the nerdy user")
      .get(domain + '/users/' + user2._id + '/challenges/page/1')
      .expectStatus(200)
      .afterJSON(function(challenges){
        expect(challenges).toBeDefined();
        expect(challenges.length).toEqual(1);
        expect(challenges[0].submissions.length).toEqual(1);
        expect(challenges[0].submissions[0].thumbnail).toBeDefined();
        expect(challenges[0].expiration).toBeDefined();
        expect(challenges[0].owner).toBeDefined();
        expect(challenges[0].title).toBeDefined();
        expect(challenges[0].unscored).toBeDefined();
        expect(challenges[0].numParticipants).toBeDefined();
        // expect as of gh#107 everyone defaults to accepted
        expect(challenges[0].inviteStatus).toEqual('accepted');
        // want username gh#106
        expect(challenges[0].owner.username).toBeDefined();
        cb(null);
      })
      .toss();
    },
    // function(cb){
    //   // TODO assume that the user doesn't need to accept anymore but test as if they have #116 #107
    //   //have nerdy accept the invitation frisby
    //   frisby
    //   .create("Have nerdy accept the invitation")
    //   .post(domain + '/challenges/' + challenge1._id + '/accepts', {
    //     user: user2._id
    //   })
    //   .expectStatus(200)
    //   .afterJSON(function(res){
    //     expect(res.clientMsg).toBeDefined();
    //     cb(null);
    //   })
    //   .toss();
    // },
    function(cb){
      //now see how nerdy's list of challenges look after accepting the challenge
      frisby
      .create("Get all the challenges for the nerdy user")
      .get(domain + '/users/' + user2._id + '/challenges/page/1')
      .expectStatus(200)
      .afterJSON(function(challenges){
        expect(challenges).toBeDefined();
        expect(challenges.length).toEqual(1);
        expect(challenges[0].numParticipants).toEqual(3);
        expect(challenges[0].unscored).toBeDefined();
        expect(challenges[0].inviteStatus).toEqual('accepted'); //right now everyone is only invited
        cb(null);
      })
      .toss();
    },
    function(cb){
      //setup our challenge
      challenge2 = {
        title: 'Challenge2 Title',
        description: 'Challenge2 Description',
        tags: ['tag1', 'tag2', 'tag3'],
        owner: user2._id,
        privacy: 'private',
        expiration: (new Date()).setMonth(new Date().getMonth()+1),
        invites: [user1._id, user3._id]
      };
      frisby
      .create("Have that nerdy create a challenge and invite popular")
      .post(domainV2 + '/challenges', challenge2)
      .expectStatus(200)
      .afterJSON(function(challenge){
        expect(challenge._id).toBeDefined();
        challenge2._id = challenge._id;
        cb(null);
      })
      .toss();
    },
    function(cb){
      //popular should now have two challenges, one as owner one invited
      frisby
      .create("Get all the challenges for the popular user")
      .get(domain + '/users/' + user1._id + '/challenges/page/1')
      .expectStatus(200)
      .afterJSON(function(challenges){
        expect(challenges).toBeDefined();
        expect(challenges.length).toEqual(2);
        challenges.forEach(function(challenge, index){
          if (challenge.owner._id === user1._id){
            // TODO, consider simplifying and not worrying about owner #117
            expect(challenge.inviteStatus).toEqual('owner');
            expect(challenge.participants).toBeUndefined();
          } else {
            expect(challenge.inviteStatus).toEqual('accepted');
          }
        });
        cb(null);
      })
      .toss();
    },
    function(cb){
      //check now nerdy should have an additional challenge
      frisby
      .create("Get all the challenges for the nerdy user")
      .get(domain + '/users/' + user2._id + '/challenges/page/1')
      .expectStatus(200)
      .afterJSON(function(challenges){
        expect(challenges).toBeDefined();
        expect(challenges.length).toEqual(2);
        challenges.forEach(function(challenge, index){
          if (challenge.owner._id === user2._id){
            expect(challenge.inviteStatus).toEqual('owner');
            expect(challenge.participants).toBeUndefined();
          } else {
            expect(challenge.inviteStatus).toEqual('accepted');
          }
        });
        cb(null);
      })
      .toss();
    },
    function(cb){
      //now have popular decline this challenge
      frisby
      .create("Have popular decline the challenge")
      .post(domain + '/challenges/' + challenge2._id + '/declines', {
        user: user1._id
      })
      .expectStatus(200)
      .afterJSON(function(res){
        expect(res.clientMsg).toBeDefined();
        cb(null);
      })
      .toss();
    },
    function(cb){
      //gh#43 is recreated by this issue
      //popular (above) declining a challenge should have no effect on nerdy
      frisby
      .create("Get all the challenges for the nerdy user")
      .get(domain + '/users/' + user2._id + '/challenges/page/1')
      .expectStatus(200)
      .afterJSON(function(challenges){
        expect(challenges).toBeDefined();
        expect(challenges.length).toEqual(2);
        challenges.forEach(function(challenge, index){
          if (challenge.owner._id === user2._id){
            expect(challenge.inviteStatus).toEqual('owner');
            expect(challenge.participants).toBeUndefined();
          } else {
            expect(challenge.inviteStatus).toEqual('accepted');
          }
        });
        cb(null);
      })
      .toss();
    },
    function(cb){
      //mr popular now should only have the challenge he is the owner of
      frisby
      .create("Get all the challenges for the popular user")
      .get(domain + '/users/' + user1._id + '/challenges/page/1')
      .expectStatus(200)
      .afterJSON(function(challenges){
        expect(challenges).toBeDefined();
        expect(challenges.length).toEqual(1);
        expect(challenges[0].participants).toBeUndefined();
        expect(challenges[0].inviteStatus).toEqual('owner'); //owner shows up as someone who is owner
        cb(null);
      })
      .toss();
    },
    function(cb){
      //setup our challenge
      challenge3 = {
        title: 'Expired Challenge',
        description: 'Challenge3 Description',
        tags: ['tag1', 'tag2', 'tag3'],
        owner: user2._id,
        privacy: 'private',
        expiration: new Date(2012, 3, 14),
        invites: [user1._id, user3._id]
      };
      frisby
      .create("Have nerdy create an expired challenge")
      .post(domainV2 + '/challenges', challenge3)
      .expectStatus(200)
      .afterJSON(function(challenge){
        expect(challenge._id).toBeDefined();
        challenge3._id = challenge._id;
        cb(null);
      })
      .toss();
    },
    function(cb){
      //expired challenge shouldn't show up at all in popular's myChallenges
      frisby
      .create("Get all the challenges for the popular user")
      .get(domain + '/users/' + user1._id + '/challenges/page/1')
      .expectStatus(200)
      .afterJSON(function(challenges){
        expect(challenges).toBeDefined();
        expect(challenges.length).toEqual(1);
        expect(challenges[0].participants).toBeUndefined();
        expect(challenges[0].inviteStatus).toEqual('owner'); //owner shows up as someone who is owner
        cb(null);
      })
      .toss();
    },
    function(cb){
      //have user1 submit into the challenge
      describe("Populate the expired challenge with submissions", function(){
        it("can be submitted by a User1 into challenge 3", function(done){
          superagent
          .post(domain + "/challenges/" + challenge3._id + "/submissions")
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
            submission1._id = submission._id;
            //console.log("here is the returned superagent submission");
            //console.log(submission);
            done();
          });
        });
        it("can be submitted by a User2 into challenge 3", function(done){
          superagent
          .post(domain + "/challenges/" + challenge3._id + "/submissions")
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
            cb(null);
            done();
          });
        });
      });
    },
    function(cb){
      //but the expired challenge should show up in the archive of challenge
      frisby
      .create("Get all archived challenges for a user in this case popular")
      .get(domain + '/users/' + user1._id + '/challenges/archive/page/1')
      .expectStatus(200)
      .afterJSON(function(challenges){
        expect(challenges).toBeDefined();
        expect(challenges.length).toEqual(1);
        //tests for archive challenge return here
        expect(challenges[0].expiration).toBeDefined();
        expect(challenges[0].numParticipants).toBeDefined();
        expect(challenges[0].title).toBeDefined();
        expect(challenges[0].submissions).toBeDefined();
        expect(challenges[0].submissions.length).toEqual(1);
        expect(challenges[0].submissions[0].thumbnail).toBeDefined();
        expect(challenges[0].submissions[0].rank).toBeDefined();
        expect(challenges[0].submissions[0].score).toBeDefined();

        cb(null);
      })
      .toss();
    },
    function(cb){
      //but lets say that popular had originally declined the challenge
      frisby
      .create("Have popular decline the invitation")
      .post(domain + '/challenges/' + challenge3._id + '/declines', {
        user: user1._id
      })
      .expectStatus(200)
      .afterJSON(function(res){
        expect(res.clientMsg).toBeDefined();
        cb(null);
      })
      .toss();
    },
    function(cb){
      //in that case, it shouldn't show up in popular's archive
      frisby
      .create("Get all archived challenges for a user in this case popular")
      .get(domain + '/users/' + user1._id + '/challenges/archive/page/1')
      .expectStatus(404)
      .afterJSON(function(challenges){
        expect(challenges.clientMsg).toBeDefined();
        cb(null);
      })
      .toss();
    },
    function(cb){
      //user can hide a challenge so it doesn't appear in their archive
      frisby
      .create("Hide an archived challenge")
      .post(domain + '/challenges/' + challenge3._id + '/hidden', {
        user: user3._id
      })
      .expectStatus(200)
      .afterJSON(function(res){
        expect(res.clientMsg).toBeDefined();
        cb(null);
      })
      .toss();
    },
    function(cb){
      //now that the user has hidden their only archive challenge, they should see nothing
      frisby
      .create("Get all archived challenges for a user in this case user3")
      .get(domain + '/users/' + user3._id + '/challenges/archive/page/1')
      .expectStatus(404)
      .afterJSON(function(res){
        expect(res).toBeDefined();
        expect(res.clientMsg).toEqual("Couldn't find any challenges for this user");
        cb(null);
      })
      .toss();
    },
    function(cb){
      //nerdy should still be able to see the expired challenge as he is the owner
      frisby
      .create("Get all archived challenges for a user in this case nerdy")
      .get(domain + '/users/' + user2._id + '/challenges/archive/page/1')
      .expectStatus(200)
      .afterJSON(function(challenges){
        expect(challenges).toBeDefined();
        expect(challenges.length).toEqual(1);
        cb(null);
      })
      .toss();
    },
    function(cb){
      //nerdy can hide his challenge so it doesn't appear in their archive
      frisby
      .create("Hide an archived challenge")
      .post(domain + '/challenges/' + challenge3._id + '/hidden', {
        user: user2._id
      })
      .expectStatus(200)
      .afterJSON(function(res){
        expect(res.clientMsg).toBeDefined();
        cb(null);
      })
      .toss();
    },
    function(cb){
      //now that the nerdy has hidden the expired challenge he is the owner of, he shouldn't see it
      frisby
      .create("Get all archived challenges for a user in this case nerdy")
      .get(domain + '/users/' + user2._id + '/challenges/archive/page/1')
      .expectStatus(404)
      .afterJSON(function(res){
        expect(res.clientMsg).toEqual("Couldn't find any challenges for this user");
        cb(null);
      })
      .toss();
    },
    function(cb){
      //get a specific challenge
      frisby
      .create("Get a specific challenge by id")
      .get(domain + '/challenges/' + challenge1._id)
      .expectStatus(200)
      .afterJSON(function(challenge){
        expect(challenge.title).toEqual(challenge1.title);
        expect(challenge.tags[0]).toEqual(challenge1.tags[0]);
        expect(challenge.tags.length).toEqual(challenge1.tags.length);
        expect(challenge.owner).toBeDefined();
        expect(challenge._id).toEqual(challenge1._id);
        //expect(challenge.description).toEqual(challenge1.description);
        expect(challenge.createdOn).toBeDefined();
        expect(challenge.expiration).toBeDefined();
        expect(challenge.privacy).toEqual('private');
        expect(challenge.private).toEqual('private');
        cb(null);
      })
      .toss();
    },
    function(cb){
      //read all the users in a specific challenge
      frisby
      .create("Read all users in a specific challenge")
      .get(domain + '/challenges/' + challenge1._id + '/users/page/1')
      .expectStatus(200)
      .afterJSON(function(participants){
        expect(participants[0].user.username).toBeDefined();
        expect(participants.length).toEqual(3);
        expect(participants[0].user.thumbnail).toBeDefined();
        expect(participants[0].user._id).toBeDefined();
        cb(null);
      })
      .toss();
    },
    function(cb){
      //read all the users in a specific challenge
      frisby
      .create("Read all users in a specific challenge")
      .get(domain + '/challenges/' + challenge1._id + '/users/page/2')
      .expectStatus(200)
      .afterJSON(function(participants){
        //this makes sure the pagination is working, with only a few
        //users we expect nothing to return
        expect(participants.length).toEqual(0);
        cb(null);
      })
      .toss();
    },
    function(cb){
      //setup our challenge
      challenge4 = {
        title: 'Slightly Expired Challenge',
        description: 'Slightly Challenge3 Description',
        tags: ['tag1', 'tag2', 'tag3'],
        owner: user2._id,
        privacy: 'private',
        expiration: new Date(new Date(Date.now()).setHours(new Date(Date.now()).getHours()-23)),
        invites: [user1._id, user3._id]
      };
      frisby
      .create("Have nerdy create an expired challenge")
      .post(domain + '/challenges', challenge4)
      .expectStatus(200)
      .afterJSON(function(challenge){
        expect(challenge._id).toBeDefined();
        challenge4._id = challenge._id;
        cb(null);
      })
      .toss();
    },
    function(cb){
      //expired challenge shouldn't show up at all in popular's myChallenges
      frisby
      .create("Get all the challenges for the nerdy user")
      .get(domain + '/users/' + user2._id + '/challenges/page/1')
      .expectStatus(200)
      .afterJSON(function(challenges){
        expect(challenges.length).toEqual(3);
        expect(challenges.some(function(challenge){
          return challenge._id === challenge4._id;
        })).toEqual(true);

        cb(null);
      })
      .toss();
    },
    function(cb){
      // everyone is going to follow popular and we will make sure followers challenges work as a result
      describe('Followers challenges', function(){
        it('delete the database again', function(done){
          superagent
          .del(domain + "/server")
          .end(function(res){
            expect(res.status).toEqual(200);
            done();
          });
        });
        it("should register popular", function(done){
          superagent
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
            cb(null);
          });
        });
        it("should register nerdy", function(done){
          superagent
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
            cb(null);
          });
        });
        it("should register generic", function(done){
          superagent
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
            cb(null);
          });
        });
        it('needs to have user2 follow user1', function(done){
          superagent
          .post(domain + "/users/" + user2._id + '/follows')
          .send({
            user: user1._id,
          })
          .end(function(res){
            expect(res.status).toEqual(200);
            done();
          });
        });
        it('can be created by user1 for his followers', function(done){
          // setup challenge
          challenge5 = {
            title: 'Follower Challenge Test',
            tags: ['tag1', 'tag2', 'tag3'],
            owner: user1._id,
            privacy: 'followers',
            expiration: (new Date()).setMonth(new Date().getMonth()+1)
          };
          superagent
          .post(domainV2 + "/challenges")
          .send(challenge5)
          .end(function(res){
            expect(res.status).toEqual(200);
            // save the challenge id for future use
            challenge5._id = res.body._id;
            done();
          });
        });
        it("has correct number of participants", function(done){
          Challenge
          .findOne({_id: challenge5._id})
          .exec(function(err, challenge){
            console.log(challenge);
            expect(challenge.numParticipants).toEqual(2);
            done();
          });
        });
        it('should have user2 as participant in challenge5', function(done){
          Challenge
          .findOne({_id: challenge5._id})
          .exec(function(err, challenge){
            //console.log(challenge.participants);
            expect(challenge.participants.some(function(participant, index, array){
              // console.log('participants %s vs %s', participant.user, user2._id);
              return participant.user == user2._id;
            })).toBeTruthy();
            //console.log(challenge.participants.indexOf(user2._id));
            done();
          });
        });
        it('needs to have user3 follow user1', function(done){
          // we need to now follow user1 after he creates his followers challenge
          superagent
          .post(domain + "/users/" + user3._id + '/follows')
          .send({
            user: user1._id,
          })
          .end(function(res){
            expect(res.status).toEqual(200);
            done();
          });
        });
        it('should automatically add user3 to challenge5 even though he follows after the fact', function(done){
          // we need a little time since adding a user above after a follow is async and doesn't wait to give an success response
          setTimeout(function(){
            Challenge
            .findOne({_id: challenge5._id})
            .exec(function(err, challenge){
              //console.log(challenge.participants.length);
              expect(challenge.participants.length).toEqual(3);
              expect(challenge.participants.some(function(participant, index, array){
                // console.log('participants %s vs %s', participant.user, user3._id);
                return participant.user == user3._id;
              })).toBeTruthy();
              //console.log(challenge.participants.indexOf(user3._id));
              done();
            });
          }, 150);
        });
        it("has correct number of participants", function(done){
          // with another follower, we should see the participants number updated
          Challenge
          .findOne({_id: challenge5._id})
          .exec(function(err, challenge){
            console.log(challenge);
            expect(challenge.numParticipants).toEqual(3);
            done();
          });
        });
        it('needs to have user3 follow user1 again', function(done){
          // we will have user3 follower user 1 again to make sure that duplicate participants aren't created in the challenge
          superagent
          .post(domain + "/users/" + user3._id + '/follows')
          .send({
            user: user1._id,
          })
          .end(function(res){
            expect(res.status).toEqual(200);
            done();
          });
        });
        it('should not add user3 to the challenge again', function(done){
          // make sure user3 didn't get added to challenge5 after following again
          Challenge
          .findOne({_id: challenge5._id})
          .exec(function(err, challenge){
            //console.log(challenge.participants);
            // see how many elements match user3, there should only be 2
            expect(challenge.participants.filter(function(participant, index, array){
              //console.log('participants %s vs %s', participant.user, user3._id);
              return participant.user == user3._id;
            }).length).toEqual(1);
            done();
          });
        });
        it('should trigger the next async', function(done){
          cb(null);
          done();
        });
      });
    },
    function(cb){
      // this time we pretend popular is making a private challenge. We want to make sure no one is added to his private challenge
      describe('Followers challenges', function(){
        it('delete the database again', function(done){
          superagent
          .del(domain + "/server")
          .end(function(res){
            expect(res.status).toEqual(200);
            done();
          });
        });
        it("should register popular", function(done){
          superagent
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
          superagent
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
          superagent
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
        it('needs to have user2 follow user1', function(done){
          superagent
          .post(domain + "/users/" + user2._id + '/follows')
          .send({
            user: user1._id,
          })
          .end(function(res){
            expect(res.status).toEqual(200);
            done();
          });
        });
        it('can be created by user1 for his friends only, not followers', function(done){
          // setup challenge
          challenge5 = {
            title: 'Follower Challenge Test',
            tags: ['tag1', 'tag2', 'tag3'],
            owner: user1._id,
            privacy: 'private',
            invites: [], //no one was invited, classic popular
            expiration: (new Date()).setMonth(new Date().getMonth()+1)
          };
          superagent
          .post(domainV2 + "/challenges")
          .send(challenge5)
          .end(function(res){
            expect(res.status).toEqual(200);
            // save the challenge id for future use
            challenge5._id = res.body._id;
            done();
          });
        });
        it("has correct number of participants", function(done){
          Challenge
          .findOne({_id: challenge5._id})
          .exec(function(err, challenge){
            console.log(challenge);
            expect(challenge.numParticipants).toEqual(1);
            done();
          });
        });
        it('should not have user2 as participant in challenge5', function(done){
          Challenge
          .findOne({_id: challenge5._id})
          .exec(function(err, challenge){
            //console.log(challenge.participants);
            expect(challenge.participants.some(function(participant, index, array){
              // console.log('participants %s vs %s', participant.user, user2._id);
              return participant.user == user2._id;
            })).not.toBeTruthy();
            //console.log(challenge.participants.indexOf(user2._id));
            done();
          });
        });
        it('needs to have user3 follow user1', function(done){
          // we need to now follow user1 after he creates his followers challenge
          superagent
          .post(domain + "/users/" + user3._id + '/follows')
          .send({
            user: user1._id,
          })
          .end(function(res){
            expect(res.status).toEqual(200);
            done();
          });
        });
        it('should not automatically add user3 to challenge5 since challenge5 is private', function(done){
          // we need a little time since adding a user above after a follow is async and doesn't wait to give an success response
          setTimeout(function(){
            Challenge
            .findOne({_id: challenge5._id})
            .exec(function(err, challenge){
              //console.log(challenge.participants.length);
              expect(challenge.participants.length).toEqual(1);
              expect(challenge.participants.some(function(participant, index, array){
                // console.log('participants %s vs %s', participant.user, user3._id);
                return participant.user == user3._id;
              })).not.toBeTruthy();
              //console.log(challenge.participants.indexOf(user3._id));
              done();
            });
          }, 150);
        });
        it("has correct number of participants", function(done){
          // with another follower, we should see the participants number updated
          Challenge
          .findOne({_id: challenge5._id})
          .exec(function(err, challenge){
            console.log(challenge);
            expect(challenge.numParticipants).toEqual(1);
            done();
          });
        });
        it('needs to have user3 follow user1 again', function(done){
          // we will have user3 follower user 1 again to make sure that duplicate participants aren't created in the challenge
          superagent
          .post(domain + "/users/" + user3._id + '/follows')
          .send({
            user: user1._id,
          })
          .end(function(res){
            expect(res.status).toEqual(200);
            done();
          });
        });
        it('should not add user3 to the challenge again', function(done){
          // make sure user3 didn't get added to challenge5 after following again
          Challenge
          .findOne({_id: challenge5._id})
          .exec(function(err, challenge){
            //console.log(challenge.participants);
            // see how many elements match user3, there should only be 2
            expect(challenge.participants.filter(function(participant, index, array){
              //console.log('participants %s vs %s', participant.user, user3._id);
              return participant.user == user3._id;
            }).length).not.toEqual(1);
            done();
          });
        });
        it('should trigger the next async', function(done){
          cb(null);
          done();
        });
      });
    },
  ],
  function(err, results){
    callback(null);
  });
};
