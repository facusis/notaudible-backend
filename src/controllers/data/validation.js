const models = require('../../mongo');

const validationEntityMiddleware = (req, res, next) => {
  if (models[req.params.entity] === undefined) {
    res.status(400).send({ message: "The entity " + req.params.entity + " is not known"});
  } else {
    return next();
  }
}
const validationEntityIdMiddleware = (req, res, next) => {
  if (req.params.id !== undefined && req.params.id.length !== 24) {
    res.status(400).send({ message: "The id should have 24 hex chars"});
  } else {
    return next();
  }
}

module.exports = {
  validationEntityMiddleware,
  validationEntityIdMiddleware,
}
