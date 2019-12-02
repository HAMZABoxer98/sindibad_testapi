const getEmailConfirmationMarkdown = require('../mail/markdown/EmailConfirmation')
const { Sequelize, sequelize } = require('./SequelizeConnection');
const sendMail = require('../mail/nodemailer')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('config')
const _ = require('lodash')

function hashPassword(password, saltRounds) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) reject(err)
      else {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) reject(err)
          else resolve(hash)
        });
      }
    });
  })
}

const hooks = {
  async beforeCreate(model) {
    try {
      model.password = await hashPassword(model.password, config.get('bcrypt_saltRounds'))
    } catch (err) {
      throw err;
    }
  },

  afterCreate(model) {
    try {
      const confirmationToken = jwt.sign(model.email, config.get('jwt_token.secret')
      /**
      * @todo: why expiresIn is not accepting this 
      , {
        expiresIn: config.get('jwt_token.emailConfirmationExpiresIn')
      } */)
      sendMail({
        to: model.email,
        subject: "Email Confirmation",
        text: "Please confirm your email",
        html: getEmailConfirmationMarkdown({
          link: `${config.get('website.domain')}/auth/confirm/email?token=${confirmationToken}`
        })
      })
    } catch (err) {
      throw err;
    }
  }
}

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
    /**
     * 0 => email not confirmed
     * 1 => email confirmed
     */
    defaultValue: 0
  }
}, {
  hooks
});

/**
 * pick these info for public use only
 * example: to create token or to show user info
 * @param {*} user
 */
User.pickUserInfo = function (user) {
  return _.pick(
    user, ['email', 'status', 'createdAt', 'updatedAt'])
}

module.exports = User