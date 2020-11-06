require('./connection');
const User = require('./schemas/User');
const VerifyPassCode = require('./schemas/VerifyPassCode');
const {initFirstUser} = require('./initFirstUser');


initFirstUser(User);

module.exports = {
  user: User,
  verifyPassCode: VerifyPassCode
}
