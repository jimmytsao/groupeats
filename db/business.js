
var mongoose = require('mongoose');
var prom = require('../server/promisified.js');
var blue = require('bluebird');
var mapApi = require('../server/mapsApiHelpers.js')

var businessSchema = mongoose.Schema({
  businessName: 
    {type: String,required: true},
  address: 
    {type: String,required: true},
  city: 
    {type: String,required: true},
  state: 
    {type: String,required: true},
  zipCode: 
    {type: Number,required: true},
  location:
    {type: Array, index: '2dsphere'}, //Store long, lat in Mongo -- Google gives it in lat, long
  username: 
    {type: String,required: true},
  password: 
    {type: String,required: true},
  firstName: 
    {type: String,required: true},
  lastName: 
    {type: String,required: true},
  phoneNumber: 
    {type: Number,required: true},
  email: 
    {type: String,required: true},
  createdAt: 
    {type: Date,default: Date.now}
});

//Set up mongoose index for geospatial
businessSchema.index({location: '2dsphere'});


//bcrypt password and get geolocation before saving into db
businessSchema.pre('save', function(next){

  var that = this;

  //bcrypt the password and store to password property
  prom.bcryptHash(this.password, null, null)
  .then(function(hash){
    that.password=hash;

    //create new promise to continue chain
    return new blue(function(resolve, request){
      resolve(that);
    });
  })

  //get Geo location from google maps
  .then(mapApi.getGeo)

  //convert response to Long/Lat
  .then(mapApi.parseGeoResult)

  //update Long/Lat coordinates to location
  .then(function(result){
    that.location = result;

    //move forward with saving
    next();
  })

});

var Business = mongoose.model('groupEatBusiness', businessSchema);

//converting model functions to promisified functions
Business.promFind = blue.promisify(Business.find);
Business.promFindOne = blue.promisify(Business.findOne);

Business.blueAggregate = blue.promisify(Business.aggregate);

Business.blueAggregate([{
  $geoNear: {
    near: [-122.415094,37.773899],
    distanceField: 'dist.calculated',
    maxDistance: 27/3963,
    spherical: true
  }
}])
.then(function(result){
})

exports.Business = Business;

// var test1 = new Business({
//   businessName: 'Chicago',
//   address: '517 W 26th St',
//   city: 'Chicago',
//   state: 'IL', 
//   zipCode: 60616,
//   username: 'tsao517',
//   password: 'tsao517',
//   firstName: 'chicago',
//   lastName: 'home',  
//   phoneNumber: 123423, 
//   email: 'tsao517@gmail.com'
// });

// test1.save();
