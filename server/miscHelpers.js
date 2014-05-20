
var blue = require('bluebird');

exports.parseNearbyData = function(array){
  var allBus = [];
  var bus;
  var phoneNums = [];

  for (var i = 0; i<array.length; i++){
    bus = {};
    bus._id = array[i]._id;
    bus.distance = array[i].dist.calculated*3963;
    bus.status = 'Pending';
    bus.replies = [];

    allBus.push(bus);
    phoneNums.push(array[i].phoneNumber);
  }

  console.log('allBus: ',allBus);
  console.log('phoneNums: ',phoneNums);

  return new blue (function(resolve, reject){
    resolve([allBus, phoneNums]);
  });

};

exports.parseRequestFormData = function(obj){

  var dateTime = obj.targetDate+' '+obj.targetTime;

  var parsedObj = {
    targetDateTime: new Date (dateTime),
    groupSize: obj.groupSize,
    requestNotes: obj.requestNotes,
    address: obj.address,
    city: obj.city,
    state: obj.state,
    radius: obj.radius,
    active: true
  }

  return parsedObj;
 }





