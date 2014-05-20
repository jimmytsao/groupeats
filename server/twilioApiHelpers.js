
var twilioAccountSid = 'ACa7d714bdc28de2aeea0670a56891699b';
var twilioAuthToken = 'fb21f4ea443e2a2dabec472c31400ea1';
var twilio = require('twilio')(twilioAccountSid, twilioAuthToken);
var misc = require('./miscHelpers.js');

var prom = require('./promisified.js');
var blue = require('bluebird');

var promTwilSend = blue.promisify(twilio.messages.create);

//promise will pass in an array containing a list of numbers and the request object
exports.massTwilSend = function(array){

  var numbers = array[0];
  var obj = array[1];
  var formattedNumber;
  var formattedDate = misc.formatDate(obj.targetDateTime);

  var message = 'ID: ('+obj.requestId+') - Group of '+obj.groupSize+ ' on '+ formattedDate+'. Notes: '+obj.requestNotes
                +'. Reply with the ID, either Accept or Decline, and your offer. Example: ('+obj.requestId+') - Accept - 10%off' ;


  for (var i = 0; i<numbers.length; i++){

    formattedNumber='+1'+numbers[i];
    console.log(formattedNumber, 'message', message );

    promTwilSend({
      body: message,
      to: formattedNumber,
      from: '+13122340362'
    })
    .then(function(data){
      console.log('Message Successfully Sent');
    })

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