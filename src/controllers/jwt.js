var jwt = require('jsonwebtoken');

const jwtMiddleware = require('express-jwt');
const passwordHash = require('password-hash');
const data = require('../mongo');
const {jwtSecret} = require("../config");

const configSecurity = (app) => {
  app.use(
    jwtMiddleware({
      secret: jwtSecret,
      algorithms: ['HS256']
    }).unless({ path: ['/login','/register'] })
  );
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const users = await data.user.find({email: email});
    if (users.length === 1 && passwordHash.verify(password, users[0].password)) {
      const user = users[0];
      const token = jwt.sign({ id: user._id }, jwtSecret);
      res.send({ token });
    } else {
      res.status(401).send({ message: 'Username or password incorrect' });
    }
  });

  app.post('/register', async (req, res) => {
    const user = new data.user(req.body);
    return user.save().then(() => {
      const token = jwt.sign({id: user._id }, jwtSecret);
      res.send({ token });
    }).catch((err) => {
      res.status(500).send({error: err})
    });
  });
}

module.exports = {
  configSecurity,
}
