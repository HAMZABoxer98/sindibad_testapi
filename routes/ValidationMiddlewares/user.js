const { check } = require('express-validator');
const UserModel = require('../../model/UserModel')

module.exports = {
  RegisterValidation: [
    check('email').exists().isEmail(),
    check('password').exists(),
    check('password_confirmation', 'password confirmation must have the same value as the password field')
      .exists()
      .custom((value, { req }) => {
        if (value != req.body.password) {
          throw new Error('Password confirmation does not match password');
        } else {
          return true;
        }
      })
  ],

  LoginValidation: [
    check('email').exists().isEmail(),
    check('password').exists(),
    function (req, res, next) {
      const email = req.body.email
      const password = req.body.password
      UserModel.findOne({
        where: {
          email
        }
      }).then(async (user) => {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          req.user = UserModel.pickUserInfo(user)
          return next()
        } else {
          return res.status(403).json({
            errors: [
              { msg: `Couldn't find a user with these credentials.` }
            ]
          })
        }
      })
    }
  ]
}