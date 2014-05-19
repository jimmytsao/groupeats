
var User = require('../db/user.js').User;
var prom = require('./promisified.js');

exports.sendIndex = function (req, res){
  res.sendfile('./views/index.html');
};

exports.sendAuthFail = function (res){
  res.send(404, 'failed authentication!');
}

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
      res.sendfile('./views/userDashboard.html');

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

  User.promFindOne({username: req.body.username})
  .then(function(data){
    if(data){
      exports.sendAuthFail(res);
    } else {
      new User(req.body).save(function(err){
        if(err){
          exports.sendAuthFail(res);    
        } else {
          res.sendfile('./views/userDashboard.html');
        }
      });
    }
  })
  .catch(function(e){
    console.log('signup fail: ', e);
    exports.sendAuthFail(res);
  });
};
