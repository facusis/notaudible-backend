var jwt = require('jsonwebtoken');

const jwtMiddleware = require('express-jwt');
const passwordHash = require('password-hash');
const data = require('../mongo');
const {jwtSecret} = require("../config");
const {validationChecks} = require('./data/validation');
const {check} = require('express-validator');


const configSecurity = (app) => {

  app.use(
    jwtMiddleware({
      secret: jwtSecret,
      algorithms: ['HS256']
    }).unless({ path: ['/login', '/register', '/forgetpass', '/resetpass'] })
  );
  
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const users = await data.user.find({email});
    if (users.length === 1 && passwordHash.verify(password, users[0].password)) {
      const user = users[0];
      const token = jwt.sign({ id: user._id }, jwtSecret);
      res.send({ token });
    } else {
      res.status(401).send({ message: 'Username or password incorrect' });
    }
  });

  app.post('/register',
    [
      check('email').isEmail().withMessage('Enter a valid email addres'),
      check('nickname').not().isEmpty().isLength({ min: 6 }).withMessage('Your nickname should have at least 6 characters'),
      check('password').not().isEmpty().isLength({ min: 6 }).withMessage('your password should have at least 6 characters')
    ], validationChecks, async (req, res) => {
      const user = new data.user(req.body);
      const users = await data.user.find({ email: user.email });
      if (users.length == 0) {
        return user.save().then(() => {
          const token = jwt.sign({ id: user._id }, jwtSecret);
          res.send({ token });
        }).catch((err) => {
          res.status(500).send({ error: err })
        });
      }

      res.status(409).send({ message: 'Email already exist' });
    });

}

module.exports = {
  configSecurity,
}