const { RegisterValidation, LoginValidation } = require('../../ValidationMiddlewares/user')
const { validationResult } = require('express-validator');
const UserModel = require('../../../model/UserModel')
const jwt = require('jsonwebtoken');
var express = require('express');
const config = require('config')
const _ = require('lodash');
var router = express.Router();

router.post('/register', RegisterValidation, function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() })
  } else {
    UserModel
      .findOrCreate({
        where: { email: req.body.email },
        defaults: _.pick(req.body, ['email', 'password'])
      })
      .then(([user, created]) => {
        const userObject = user.get({
          plain: true
        })
        if (created) {
          return res.status(201).send({ success: [{ msg: 'Please confirm your email.' }] })
        }
        if (userObject && userObject.email) {
          return res.status(400).send({ errors: [{ msg: 'This email already exists.' }] })
        }
      })
  }
})

router.post('/login', LoginValidation, function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() })
  } else {
    jwt.sign(req.user, config.get('jwt_token.secret'), (err, token) => {
      if (err) {
        throw err;
      } else {
        return res.status(200).json({
          success: [
            { msg: 'logged successfully', token }
          ]
        })
      }
    })
  }
})

module.exports = router;
