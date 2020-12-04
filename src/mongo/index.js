require('./connection');
const User = require('./schemas/User');
const VerifyPassCode = require('./schemas/VerifyPassCode');
const Book = require('./schemas/Book');
const Category = require('./schemas/Category');
const {initFirstUser} = require('./initFirstUser');
const {initCategory} = require('./initFirstCategory');



initFirstUser(User);
initCategory(Category);

module.exports = {
  user: User,
  verifyPassCode: VerifyPassCode,
  book: Book,
  category: Category
}
