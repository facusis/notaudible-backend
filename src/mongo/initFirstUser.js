const passwordHash = require('password-hash');
const {adminEmail, adminPassword} = require("../config");

const initFirstUser = (User) => {
  User.countDocuments()
    .then((count) => {
      if (count === 0) {
        console.log('No users found, going to create first user')
        const admin = new User({ email: adminEmail, password: adminPassword });
        admin.save();
      }
    })
}

module.exports = {
  initFirstUser,
}
