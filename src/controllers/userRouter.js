const express = require("express");
const models = require("../mongo");
const { validationChecks } = require("./data/validation");
const { check } = require("express-validator");
const passwordHash = require("password-hash");
const { model } = require("mongoose");


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
       verifyCode
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
               models.verifyPassCode.findByIdAndDelete(passCode[0].id);
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

  router.use('/getbook/:id', async (req, res) => {
     models.book.findById(req.params.id)
      .populate('category', 'name')
      .populate('user', 'nickname')
    .then(book => {
      res.send(book);
    }).catch((err) => {
        res.status(500).send({ error: err})
      })
  });


  // follow a user
  router.post("/follow", (req, res) => {

    const follower = req.body.follower;
    const following = req.body.following;

    const newFollowObject = new models.follow({follower, following});

     newFollowObject.save().then((result) => {
      res.send(result);
    }).catch((err) => {
      res.status(500).send({error: err})
    });
  });
  // unfollow a user
  router.post("/follow", (req, res) => {
    const follower = req.body.follower;
    const following = req.body.following;

     models.follow.findAndDelete({follower, following}).then(() => {
      res.status(204).send();
    }).catch((err) => {
      res.status(500).send({error: err})
    });
  });

  // get my followings
  router.get('/my-followings', (req, res) => {
    const follower = req.body.follower;

     models.follow.find({follower}).then((result) => {
        if (result) {
          res.status(200).send(result);
        } else {
          res.status(404).send();
        }
      }).catch((err) => {
        res.status(500).send({error: err})
      })
    });

    // get my followers
    router.get('/my-followers', (req, res) => {
      const userId = req.body.userId;
  
       models.follow.find({following: userId}).then((result) => {
          if (result) {
            res.status(200).send(result);
          } else {
            res.status(404).send();
          }
        }).catch((err) => {
          res.status(500).send({error: err})
        })
      });
  
  // get my followings
  router.get('/followings', (req, res) => {
    const following = req.body.following;

     models.follow.find({following}).then((result) => {
        if (result) {
          res.status(200).send(result);
        } else {
          res.status(404).send();
        }
      }).catch((err) => {
        res.status(500).send({error: err})
      })
    });


  // get all users 
  router.get('/', (req, res) => {
    models.user.find({}, (err, users) =>{
      res.send(users);
    });
  })

  // get a user by id
  router.get('/:id', (req, res) => {
    const id = req.params.id;
     models.user.findById(id).then((result) => {
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(404).send();
      }
    }).catch((err) => {
      res.status(500).send({error: err})
    });
  })


  router.post('/comments', async (req, res) => {

    const newComment = new models.comments({
      comment,
      userId,
      bookId,
      creationDate: new Date()})
    
      newComment.save().then((result) => {
      res.status(200).send({ message: code});
    }).catch((err) => {
      res.status(500).send({ error: err })
    });
  });
  return router;
};

module.exports = userRouter;
