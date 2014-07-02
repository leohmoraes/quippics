
Submission
----------------------
Routes here are related to creating, reading submissions

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
#####_Status: Developed, Tested
GET '/v1/challenges/:cid/submissions/top'

Example Response
```
response.body: 
{ 
  __v: 3,
  _id: '52fec7b4cb9c788b1b00001c',
  owner: 'Jack1234',
  score: 9,
  createdOn: '2014-02-15T01:49:40.564Z',
  image: '01021000sf0fs0er0ew0rqgfsgaffdasfeq'
}
```
####Read all the submissions for a challenge where the user has voted
#####_Status: Developed, Tested
GET '/v1/challenges/:cid/submissions/users/:uid/voted'

Example Response
```
response: 
[ '52fc2fd313dd08084e000396',
  '52fc2fd313dd08084e00039a' ]
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
  score: 9,
  thumbnail: 'iVBORw0KGgoAAAANSUh', 
 }
```
####Read a specific submission
#####_Status: Developed, Tested
GET /v1/challenges/:cid/submissions/:sid

Example Response
```
{
  "__v": 4,
  "_id": "535071535897f4b97500000f",
  "challenge": "535071535897f4b97500000b",
  owner: {
    username: 'jack1234'
  },
  challenge: {
    title: 'Challenge Title'
  },
  "rank": 1,
  "score": 9,
  "thumbnail": {
      "data": "iVBORw0KGg",
      "contentType": "image/png"
  },
  "image": {
      "data": "iVBORw0KGgoAAAANSUhEUgAAA",
      "contentType": "image/png"
  },
  "createdOn": "2014-04-18T00:26:59.816Z"
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
