const passwordHash = require('password-hash');
const data = require('../mongo');
const {validationChecks} = require('./data/validation');
const {check} = require('express-validator');
//const {sendMail} = require('./data/nodemailer');


const userRouters = (app) => {

  app.post('/forgetpass', async (req, res) => {
    const { email } = req.body;
    const user = await data.user.find({email});
    if ( user.length > 0 ) {
      let code = Math.round((Math.random()*9000) +1000);
      const verifyCode = new data.verifyPassCode({ email, verifypassCode: code })
      return verifyCode.save().then((result) => {
        //sendMail(code, email);
        res.status(200).send({ message: 'code'});
      }).catch((err) => {
        res.status(500).send({ error: err })
      });
    } 

    res.status(401).send({ message: 'Email incorrect' });
  });

  app.use('/resetpass', [
    check('newPassword').not().isEmpty().isLength({ min: 6 }).withMessage('your password should have at least 6 characters')
  ], validationChecks, async (req, res) => {
    const { verifypassCode, newPassword, email } = req.body;
    const passCode = await data.verifyPassCode.find({verifypassCode});
    if (passCode.length > 0 && passCode[0].email === email) {
      let password = passwordHash.generate(newPassword);
      await data.user.findOneAndUpdate({ email: passCode[0].email }, { password } ).then((result) => {
        if (result) {
          res.status(200).send({ message: 'La contraseña de ha cambiado correctamente' });
          return data.verifyPassCode.findByIdAndDelete(passCode[0].id);
        }
      }).catch((err) => {
        res.status(500).send({ error: err })
      });
    } else {
      res.status(401).send({ message: 'El Codigo de recuperacion es incorrecto' });
    }
  });

  app.use('/upload', (req, res) => {

    const book = new data.book({
      title: req.body.title,
      author: req.body.author,
      category: req.body.category,
      user: req.user.id
    });

    const user = req.user.id;

    return book.save().then(result => {

      data.category.findByIdAndUpdate(req.body.category, { $push: { books: result._id } })
      .then((book) => {
        res.status(200).send(book)
      })

      data.user.findByIdAndUpdate(user, { $push: { books: result._id } })
      .then((result) => {
        res.status(200).send(result)
      })

    }).catch((err) => {
      res.status(500).send({ error: err })
    });
  });
}

module.exports = {
    userRouters,
}