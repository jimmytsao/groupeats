
var twilioAccountSid = 'ACa7d714bdc28de2aeea0670a56891699b';
var twilioAuthToken = 'fb21f4ea443e2a2dabec472c31400ea1';
var twilio = require('twilio')(twilioAccountSid, twilioAuthToken);

var prom = require('./promisified.js');
var blue = require('bluebird');

var promTwilSend = blue.promisify(twilio.messages.create);

exports.massTwilSend = function(array, message, requestId){


  //work on massTwilText after creating request collection
  for (var i = 0; i<array.length; i++){
    // promTwilSend({

    // });
  }

}

// twilio.messages.create({
//     body: 'testing123',
//     to: '+13124794923',
//     from: '+13122340362',
//   }, function(err,message){
//     console.log('twilio send response: ', message);
//   }
// );