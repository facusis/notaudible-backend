require('./connection');
const User = require('./schemas/User');
const VerifyPassCode = require('./schemas/VerifyPassCode');
const Book = require('./schemas/Book');
const {initFirstUser} = require('./initFirstUser');


initFirstUser(User);

module.exports = {
  user: User,
  verifyPassCode: VerifyPassCode,
  book: Book
}
