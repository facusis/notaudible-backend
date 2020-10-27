require('./connection');
const User = require('./schemas/User');
const {initFirstUser} = require('./initFirstUser');


initFirstUser(User);

module.exports = {
  User: User,
}
