const mung = require('express-mung');

const removeSensitiveKeys = (object) => {
  const newObject = {};
  const oldKeys = Object.keys(object);
  const newKeys = oldKeys.filter(key => !key.startsWith('sensitive'));
  if (newKeys.length === oldKeys.length) {
    return object;
  } else {
    newKeys.forEach(key => {
      newObject[key] = object[key];
    })
    return newObject;
  }
}

const recursiveApply = (object, func) => {
  if (object === undefined || object === null) {
    return object;
  }
  if (Array.isArray(object)) {
    return object.map(x => recursiveApply(x, func));
  }
  if (typeof object === 'object' && object !== null) {
    if (object._doc) {
      object._doc = func(object._doc);
    }
    return object;
  }
  return object;
}

/* Remove any classified information from the response. */
const redact = (body, req, res) => {
  body = recursiveApply(body, removeSensitiveKeys);
  return body;
}

module.exports = {
  redactMiddleware: mung.json(redact),
}
