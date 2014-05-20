
var mongoose = require('mongoose');
var blue = require('bluebird');


var requestSchema = mongoose.Schema({

  requestId: 
    {type: Number,required: true},
  requesterId: 
    {type: mongoose.Schema.Types.Mixed,required: true},    
  active: 
    {type: Boolean},
  targetDateTime: 
    {type: Date,required: true},
  groupSize:
    {type: Number,required: true},
  requestNotes:
    {type: String},
  address: 
    {type: String,required: true},
  city: 
    {type: String,required: true},
  state: 
    {type: String,required: true},
  radius: 
    {type: Number,required: true},
  createdAt: 
    {type: Date,default: Date.now},
  location:
    {type: Array, index: '2dsphere'}, //Store long, lat in Mongo -- Google gives it in lat, long
  businesses:
    {type: Array},

});


var UserRequest = mongoose.model('UserRequest', requestSchema);

exports.UserRequest = UserRequest;