
var User = require('../db/user.js').User;
var prom = require('./promisified.js');
var authen = require('./authenHelpers.js');
var mapApi = require('./mapsApiHelpers.js');
var blue = require('bluebird');
var Business = require('../db/business.js').Business;
var misc = require('./miscHelpers.js');
var twilio = require('./twilioApiHelpers.js');
var UserRequest = require('../db/userRequest.js').UserRequest;
var Counter = require('../db/counter.js').Counter;
exports.sendIndex = function (req, res){
  res.sendfile('./views/index.html');
};

exports.sendAuthFail = function (res){
  res.send(404, 'failed authentication!');
};

exports.dashboard = function(req, res, next){
  res.sendfile('./views/userDashboard.html');
};

exports.login = function(req, res){

  //Find the account that matches the username
  User.promFindOne({username: req.body.username})
  .then(function(data){

    //return a promise to continue the chain - promise will be resolved
    //once bcrypt completes the comparison
    return prom.bcryptCompare(req.body.password, data.password)
  })

  //check the results of the comparison
  .then(function(result){

    //if the passwords match - direct to the user dashboard
    if (result){
      authen.userCreateSession(req);
      res.redirect(302,'/dashboard');

    //if the passwords don't match redirect
    } else {
      console.log('user password do not match')
      exports.sendAuthFail(res);
    }
  })

  //if the account does not already exist redirect
  .catch(function(e){
    console.log('user didnt find username');   
    exports.sendAuthFail(res);
  })
};

exports.signup = function(req, res){

  //check to see if user username exists in database
  User.promFindOne({username: req.body.username})
  .then(function(data){

    //if the user username exists, redirect
    if(data){
      console.log('user username already exists')
      exports.sendAuthFail(res);

    //otherwise, save the user account into the database and redirect to user dashboard
    } else {
      new User(req.body).save(function(err){
        if(err){
          console.log('issue saving new user account');
          exports.sendAuthFail(res);    
        } else {
          res.sendfile('./views/userDashboard.html');
        }
      });
    }
  })

  //if there was an issue searching for the user, redirect
  .catch(function(e){
    console.log('signup fail: ', e);
    exports.sendAuthFail(res);
  });
};

exports.request = function(req,res){

  //parse the request form data
  var parsed = misc.parseRequestFormData(req.body);
  var requestObj;

  //get userId of requestor
  User.promGetUserId(req.session.userUsername)

  //update the parsed object info with the requestorId
  .then(function(data){
    parsed.requesterId = data._id; //NOTE: may have issues later since we saved the id as a string

    //start another promise to keep the chain going
    return new blue(function(resolve, reject){
      resolve(req.session.userUsername);
    });
  })

  //get the next request counter number
  .then(Counter.getRequestsCounter)

  //update the parsed object info with the request counter
  .then(function(data){
    parsed.requestId = data.count;
    requestObj = new UserRequest(parsed);
    requestObj.save(function(err, data){
      if(err){
        console.log('INITIAL SAVE ERROR: ',err);
      }
    });

    return new blue(function(resolve, reject){
      resolve(parsed);
    })
  })

  //get Long/Lat from google maps
  .then(mapApi.getGeo)

  //convert response to Long/Lat
  .then(mapApi.parseGeoResult)

  .then(function(result){
    requestObj.location = result;
    requestObj.save(function(err, data){
      if(err){
        console.log('2nd SAVE ERROR: ', err);
      }
    });

    return new blue (function(resolve, reject){
      resolve([requestObj.location, requestObj.radius]);
    });
  })

  .then(Business.promFindNearby)

  .then(misc.parseNearbyData)

  .then(function(data){
    requestObj.businesses = data[0];

    requestObj.save(function(err, data){
      if(err){
        console.log('2nd SAVE ERROR: ', err);
      }
      console.log('3rd Save Data: ', data);
    })
  })

  res.send(200, 'check request');

  // mapApi.getGeo(requestObj)

  // //convert response to Long/Lat
  // .then(mapApi.parseGeoResult)

  // //update Long/Lat coordinates to location property
  // .then(function(result){
  //   requestObj.location = result;

  //   //make a promise that resolves with the result and miles
  //   return new blue (function(resolve, reject){
  //     resolve([requestObj.location, requestObj.radius]);
  //   });
  // })

  // //find restaurants that meet search criteria
  // .then(Business.promFindNearby)

  // //parse the data for storage and generate list of nums to send text
  // .then(misc.parseNearbyData)

  // .then(function(data){
  //   request.Obj.businesses = data[0];

  //   //TODO - finish after setting up the model
  //   res.send('201', JSON.stringify(data));
  // })

};