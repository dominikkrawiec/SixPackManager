var userModel = require('../models/userModel');

var Gym = {
  init() {
    console.log('Welcome to 6PackManager');
    var user = new userModel();

    var getUsers = user.getUserData();
    var users = [];

    getUsers.on('data', function(jedi){
      users.push(jedi);
      console.log(users)
});
  }
}

module.exports = Gym;
