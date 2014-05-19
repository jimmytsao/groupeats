
var Business = require('../db/business.js').Business;
var mapApi = require('./mapsApiHelpers.js');
var prom = require('./promisified.js');

exports.sendBusIndex = function(req, res){
  res.sendfile('./views/busIndex.html');
};

exports.businessSendAuthFail = function (res){
  res.send(404, 'failed authentication!');
}

exports.login = function(req, res){

  //Find the account that matches the username
  Business.promFindOne({username: req.body.username})
  .then(function(data){

    //return a promise to continue the chain - promise will be resolved
    //once bcrypt completes the comparison
    return prom.bcryptCompare(req.body.password, data.password)
  })

  //check the results of the comparison
  .then(function(result){

    //if the passwords match - direct to the business dashboard
    if(result){
      res.sendfile('./views/busDashboard.html');

    //if the passwords don't match redirect
    } else {
      console.log('business password do not match')
      exports.businessSendAuthFail(res);
    }
  })

  //if the account does not already exist redirect
  .catch(function(e){
    console.log('business didnt find username');
    exports.businessSendAuthFail(res);
  })

};

exports.signup = function(req, res){

};


var test1 = {
  businessName: 'Home',
  address: '1452 Howard St',
  city: 'San Francisco',
  state: 'CA', 
  zipCode: 94103,
  username: 'home123',
  password: 'home123',
  firstName: 'home',
  lastName: '123',  
  phoneNumber: 123423, 
  location: [-122.415094,37.773899],
  email: 'jt@gmail.com'
};

console.log(mapApi.parseAddress(test1));

// mapApi.getGeo(mapApi.parseAddress(test1))
// .then(mapApi.parseGeoResult)
// .then(function(result){
//   console.log(result);
// })
