
var blue = require('bluebird');
var bcrypt = require('bcrypt-nodejs');

//Promisifying functions
exports.bcryptHash = blue.promisify(bcrypt.hash);
exports.bcryptCompare = blue.promisify(bcrypt.compare);