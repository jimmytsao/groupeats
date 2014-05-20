
var UserRequest = require('../db/userRequest.js').UserRequest;
  
exports.processPost = function(req, res, next){

  var body = parseBody(req.body.Body);
  
  var query = {
    requestId: body[0],
    'businesses.phoneNumber': body[1]
  }
  var num = parseNumber(req.body.From);
  var requestId = {requestId: body[0]};
  var offer = body[1];

  UserRequest.promFindOneAndUpdate(
    query,
    {$set: 
      {
        'businesses.$.status': 'Accepted',
        'businesses.$.replies': [offer]
      }
    },
    {new: true},
    function(err, data){
      if(err){
        console.log('error updating data');
      }
      console.log('data ',data);
    }
  );

  UserRequest.findOne({requestId: body[0]}, function(err,data){
    if(err){
      console.log('found error');
    }
    console.log('data: ',data.businesses);
  })
};


var parseNumber = function(from){
  return from.slice(2)*1;
};

var parseBody = function(body){

  var splitBody = body.split('#');

  var offer = splitBody[1];
  var reqId;

  var exp = /[0-9]/g;
  var regExp = new RegExp(exp);
  reqId = splitBody[0].match(regExp).join("")*1;

  return [reqId, offer];
};

var sendXml = function(req,res,next){

  var xml = '<?xml version="1.0" encoding="UTF-8" ?><Response><Message>Received: '+ JSON.stringify(req.body.Body) +' Rest of Message: '+ JSON.stringify(req.body)+'</Message></Response>';
  res.header('Content-Type','text/xml').send(xml);
};

// var test = {}
// test.body={}
// test.body.Body = '(55) # 10%off';
// test.body.From = '+13124794923';









