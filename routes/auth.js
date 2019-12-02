
var express = require('express');
var router = express.Router();

router.get('/register', function (req, res, next) {
  res.render('register')
})

router.get('/confirm', function (req, res, next) {
  res.render('confirmEmail')
})

router.put('/confirm/email', function (req, res) {
  let confirmationToken = req.query.token
  if (!confirmationToken) {
    return res.status(400).json({
      errors: [
        {
          msg: 'token query is required. /confirm/email?token=yourToken',
        }
      ]
    })
  }
  jwt.verify(confirmationToken, config.get('jwt_token.secret'), (err, decodedEmail) => {
    if (err && err.name === "TokenExpiredError") {
      return res.status(400).send({
        errors: [
          { msg: 'Expired, try to resend a new confirmation email.' }
        ]
      })

    } else if (err) {
      return res.status(400).send({
        errors: [
          { msg: 'Not working, try to resend a new confirmation email.' }
        ]
      })

    } else {
      /**
       * in case everything is okay, we must 
       * update the user's status to confirmedEmail
       */
      UserModel.findOne({ where: { email: decodedEmail } })
        .then(function (user) {
          // Check if record exists in db
          if (user) {
            user.update({
              status: 'confirmedEmail'
            })
              .then((updatedUser) => {
                const user = updatedUser.get({
                  plain: true
                })
                jwt.sign(
                  UserModel.pickUserInfo(user),
                  config.get('jwt_token.secret'),
                  (err, token) => {
                    if (err) throw err;
                    else {
                      return res.status(201).send({
                        success: [
                          {
                            msg: 'Email confirmed successfully.',
                            data: {
                              token,
                              ...UserModel.pickUserInfo(user)
                            }
                          }
                        ]
                      })
                    }
                  })
              })
          } else {
            return res.status(400).send({
              errors: [
                { msg: `This token doesn't belong to any user.` }
              ]
            })
          }
        })
    }
  })
})

module.exports = router;
