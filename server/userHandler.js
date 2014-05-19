
var User = require('../db/user.js').User;
var prom = require('./promisified.js');
var authen = require('./authenHelpers.js');

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
