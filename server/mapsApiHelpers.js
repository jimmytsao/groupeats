
var request = require('request');
var prom = require('./promisified.js');
var blue = require('bluebird');



exports.parseAddress = function(obj){
  // console.log('obj at parseAddress: ',obj);

  var parsedAddress = [];

  parsedAddress = parsedAddress.concat(obj.address.split(" "),',');
  parsedAddress = parsedAddress.concat(obj.city.split(" "),',');
  parsedAddress = parsedAddress.concat(obj.state.split(" "));

  return parsedAddress.join('+');
};

exports.getGeo = function(obj){
  
  // console.log('obj at getGeo: ',obj);
  var parsedAddress = exports.parseAddress(obj);

  var googleUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';
  var sensor = 'sensor=false';
  var key = 'key=AIzaSyAeJONHdaYxuuLrpJ4yg9owBH3ZzVqXfP0'
  var fullUrl = googleUrl+'address='+parsedAddress+'&'+sensor+'&'+key;

  console.log('full URL: ', fullUrl);

  var reqObj = {
    method: 'GET',
    url: fullUrl
  }

  //bluebird will put both the response and body objects in an array and pass to next function
  return prom.request(reqObj);
};

//array is passed in from the google with response and body JSON objects
exports.parseGeoResult = function (array){
  var result = JSON.parse(array[1]);
  result = result.results[0].geometry.location;
  result = [result.lng, result.lat];
  
  return new blue (function(resolve, reject){
    resolve(result);
  })
};
