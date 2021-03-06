
Submission
----------------------
Routes here are related to creating, reading submissions

####Create a new submission V2 (multipart-form)
#####_Status: Developed, Tested
#####_Notes: will allow multiple submission
POST '/v2/challenges/:cid/submissions'

Example Request
```
request.body:
{ 
  owner: '52f548514f8c88b137000113',                
}
request.files:
{
  images: 
    { contentType: 'png',
      data: '010100001111000100100…'
      filename: 'name.png'
    }
}
```
Example Response
```
response:
{
 __v: 0,
  owner: '52f548514f8c88b137000113',
  _id: '52f548514f8c88b137000118',
  ballots: [],
  createdOn: '2014-02-07T20:55:45.282Z',
  image: 
  {
     buffer: '0101011111…'
  } 
}
```
####Create a new submission (multipart-form)
#####_Status: Developed, Tested
POST '/v1/challenges/:cid/submissions'

Example Request
```
request.body:
{ 
  owner: '52f548514f8c88b137000113',                
}
request.files:
{
  images: 
    { contentType: 'png',
      data: '010100001111000100100…'
      filename: 'name.png'
    }
}
```
Example Response
```
response:
{
 __v: 0,
  owner: '52f548514f8c88b137000113',
  _id: '52f548514f8c88b137000118',
  ballots: [],
  createdOn: '2014-02-07T20:55:45.282Z',
  image: 
  {
     buffer: '0101011111…'
  } 
}
```

####Read the top rated submission in a challenge; the one with the highest score
#####_Status: Developed, Partially Tested
GET '/v1/challenges/:cid/submissions/top'

Example Response
```
response.body: 
{ 
  __v: 3,
  _id: '52fec7b4cb9c788b1b00001c',
  owner: 'Jack1234',
  score: 9,
  sum: 12,
  createdOn: '2014-02-15T01:49:40.564Z',
  image: '01021000sf0fs0er0ew0rqgfsgaffdasfeq'
}
```
####Read all the submissions the user has voted
#####_Status: Developed, Tested, Depreciated
#####_Note: As of release v2.6 this will be uncessary and have unknown results when used
GET '/v1/users/:uid/submissions/voted'

Example Response
```
response: 
[ 
  { _id: '543cb9c99c01bb67d0214e29',
    owner: '52fc2fd313dd08084e000396' },
  { _id: '543cb9c99c01bb67d0214e26',
    owner: '52fc2fd313dd08084e000396' } 
]
```
####Read all the submissions for a challenge where the user has voted
#####_Status: Developed, Tested
GET '/v1/challenges/:cid/submissions/users/:uid/voted'

- The user who is the owner of the submission is also returned to prevent user from voting on self (untested)

Example Response
```
response: 
[ '52fc2fd313dd08084e000396',
  '52fc2fd313dd08084e00039a' ]
```
####Read the specific user's submission in a challenge V2
#####_Status: Developed, Tested
#####_Notes: In the case of multiple submissions, only the most recent is returned

GET '/v2/challenges/:cid/submissions/users/:uid'

Example Response
```
response: 
{ __v: 3,
  _id: '52fc36b8014f010102000036',
  owner: '52fc36b8014f010102000031',
  rank: 1,
  commentCount: 5,
  score: 9,
  thumbnail: 'iVBORw0KGgoAAAANSUh', 
  image: 'iVBORw0KGgoAAAANSUh', 
 }
```
####Read the specific user's submission in a challenge
#####_Status: Developed, Tested
GET '/v1/challenges/:cid/submissions/users/:uid'

Example Response
```
response: 
{ __v: 3,
  _id: '52fc36b8014f010102000036',
  owner: '52fc36b8014f010102000031',
  rank: 1,
  commentCount: 5,
  score: 9,
  thumbnail: 'iVBORw0KGgoAAAANSUh', 
  image: 'iVBORw0KGgoAAAANSUh', 
 }
```
####Read a specific submission
#####_Status: Developed, Not Tested
GET /v2/submissions/:sid
GET /v1/challenges/:cid/submissions/:sid

Example Response
```
{
  "__v": 4,
  "_id": "535071535897f4b97500000f",
  "challenge": "535071535897f4b97500000b",
  "comments": [
      {
        "_id": "535071565897f4b97500001f",
        "comment": "Another Comment",
        "commenter": {
           "username": 'username',
            "_id": '12323223'
            },
        "date": "2014-04-18T00:27:02.136Z"
      }
      ],
  owner: {
    username: 'jack1234',
    _id: '53c9978c8c5808246f6c0453'
  },
  challenge: {
    title: 'Challenge Title',
    description: 'Challenge Description',
    tags: ['tag1', 'tag2', 'tag3']
  },
  "rank": 1,
  "score": 9,
  "sum": 25,
  "thumbnail": {
      "data": "iVBORw0KGg",
      "contentType": "image/png"
  },
  "image": {
      "data": "iVBORw0KGgoAAAANSUhEUgAAA",
      "contentType": "image/png"
  },
  "createdOn": "2014-04-18T00:26:59.816Z",
  "prevSubmission": "53c9978c8c5808246f6c0453",
  "nextSubmission": "null"
}
```
####Read all the submissions for a specific challenge
#####_Status: Developed, Tested
GET /v1/challenges/:cid/submission/page/:page

Example Response
```
response: [ {
  __v: 3,
  _id: '52fc0d5713dd08084e0002ab',
  owner: '52fc0d5613dd08084e0002a6',
  "thumbnail": {
    "data": "iVBORw0KGgoAAAANSUhEUgAAACMAAAAjAQAAAAA2oCYII",
    "contentType": "image/png"
  }, {}, {}, {}]
```

####Read all the submissions for a specific challenge for a specific user gh #120
#####_Status: Developed, Partially Tested
#####_Notes: should match route that returns information for all submissions into a challenge.
GET /v2/challenges/:cid/users/:uid/submissions/page/1

Example Response
```
response: 
  title: 'Challenge Title',
  tags: ['tag1', 'tag2', 'tag3'],
  submissions: [{
    "__v": 4,
    "_id": "535071535897f4b97500000f",
    "challenge": "535071535897f4b97500000b",
    owner: {
      username: 'jack1234',
      _id: '53c9978c8c5808246f6c0453'
    },
  comments: [{
    _id: '53c9978c8c5808246f6c0453',
    },{
    _id: '53c9978c8c5808246f6c0453',
    }
  ],
  "image": "www.quippics-prod.com/submissions/535071535897f4b97500000f.jpg",
  },{...},{...},{...}]

```
####Read all the submissions for a specific challenge (v2) issue #86
#####_Status: Partially Developed, Partially Tested
GET /v2/challenges/:cid/submissions

Example Response
```
response: 
  title: 'Challenge Title',
  tags: ['tag1', 'tag2', 'tag3'],
  submissions: [{
    "__v": 4,
    "_id": "535071535897f4b97500000f",
    "challenge": "535071535897f4b97500000b",
    "sum": 10,
    owner: {
      username: 'jack1234',
      _id: '53c9978c8c5808246f6c0453'
    },
  comments: [{
    _id: '53c9978c8c5808246f6c0453',
    },{
    _id: '53c9978c8c5808246f6c0453',
    }
  ],
  "image": "www.quippics-prod.com/submissions/535071535897f4b97500000f.jpg",
  },{...},{...},{...}]

```

####Return submission image via exposed route
#####_Status: Partially Developed, Partially Tested
GET /v2/submissions/:sid/image.png

Example Response
```
response: 
  *pending*
```

####Flag an submission as inappropriate
#####_Status: Developed, Not Tested
POST /v1/challenges/:cid/submissions/:sid/flags

flagger: userid (string) of user performing the submission flagging

An email message is sent have a submission has been successfully flagged X number of times

Example Request 
```
request: {
  flagger: '52fc0d5713dd08084e0002ab'
  }
```
Example Success Response
```
response: {
  clientMsg: 'Submission was flagged'
  }
status: 200
```

####Remove a flagged submission
#####_Status: Developed, Not Tested
POST /v1/challenges/:cid/submissions/:sid/remove

Example Request 
```
request: {
  }
```
Example Success Response
```
response: {
  clientMsg: 'Submission was removed from the system'
  }
status: 200
```

####Keep a flagged submission
#####_Status: Not Developed, Not Tested
POST /v1/challenges/:cid/submissions/:sid/keep

Example Request 
```
request: {
  }
```
Example Success Response
```
response: {
  clientMsg: 'Submission was kept in the system'
  }
status: 200
```
