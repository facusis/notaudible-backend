const express = require("express");
const models = require("../mongo");
const { validationChecks } = require("./data/validation");
const { check } = require("express-validator");
const passwordHash = require("password-hash");
const Follow = require("../mongo/schemas/Follow");

const userRouter = () => {
  let router = express.Router();

  router.post("/forgetpass", async (req, res) => {
    const { email } = req.body;
    const user = await models.user.find({ email });
    if (user.length > 0) {
      let code = Math.round(Math.random() * 9000 + 1000);
      const verifyCode = new models.verifyPassCode({
        email,
        verifypassCode: code,
      });
      return verifyCode
        .save()
        .then((result) => {
          //sendMail(code, email);
          res.status(200).send({ message: code });
        })
        .catch((err) => {
          res.status(500).send({ error: err });
        });
    }

    res.status(401).send({ message: "Email incorrect" });
  });

  router.use(
    "/resetpass",
    [
      check("newPassword")
        .not()
        .isEmpty()
        .isLength({ min: 6 })
        .withMessage("your password should have at least 6 characters"),
    ],
    validationChecks,
    async (req, res) => {
      const { verifypassCode, newPassword, email } = req.body;
      const passCode = await models.verifyPassCode.find({ verifypassCode });
      if (passCode.length > 0 && passCode[0].email === email) {
        let password = passwordHash.generate(newPassword);
        await models.user
          .findOneAndUpdate({ email: passCode[0].email }, { password })
          .then((result) => {
            if (result) {
              res
                .status(200)
                .send({
                  message: "La contraseña de ha cambiado correctamente",
                });
              return models.verifyPassCode.findByIdAndDelete(passCode[0].id);
            }
          })
          .catch((err) => {
            res.status(500).send({ error: err });
          });
      } else {
        res
          .status(401)
          .send({ message: "Something did not turn out as you expected" });
      }
    }
  );

  router.post("/follow", (req, res) => {
    const user = Follow.findById(
      req.body.followId,
      {
        $push: { follower: req.user._id },
      },
      {
        new: true,
      },
      (err, result) => {
        if (err) {
          return res.status(422).json({
            error: err,
          });
        }
        Follow.findById(
          req.user._id,
          {
            $push: { following: req.body.followId },
          },
          { new: true }
        )
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            return res.status(422).json({ error: err });
          });
      }
    );
  });

  router.post("/unfollow", (req, res) => {
    Follow.findById(
      req.body.followId,
      {
        $pull: { follower: req.user._id },
      },
      {
        new: true,
      },
      (err, result) => {
        if (err) {
          return res.status(422).json({
            error: err,
          });
        }
        Follow.findById(
          req.user._id,
          {
            $pull: { following: req.body.followId },
          },
          { new: true }
        )
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            return res.status(422).json({ error: err });
          });
      }
    );
  });

  router.use('/getbook/:id', async (req, res) => {
    return models.book.findById(req.params.id)
      .populate('category', 'name')
      .populate('user', 'nickname')
    .then(book => {
      res.send(book);
    }).catch((err) => {
        res.status(500).send({ error: err})
      })
  });

  router.use('/getbook/:id', async (req, res) => {
    return models.book.findById(req.params.id)
      .populate('category', 'name')
      .populate('user', 'nickname')
    .then(book => {
      res.send(book);
    }).catch((err) => {
        res.status(500).send({ error: err})
      })
  });



  router.post('/comments', async (req, res) => {

    const newComment = new models.comments({
      comment,
      userId,
      bookId,
      creationDate: new Date()})
    
    return newComment.save().then((result) => {
      res.status(200).send({ message: code});
    }).catch((err) => {
      res.status(500).send({ error: err })
    });
  });
  return router;
};

module.exports = {
  userRouter,
};
