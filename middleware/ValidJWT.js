const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) {
  let token = req.headers['authorization']
  if (token && token.startsWith('Bearer ')) {
    // remove Bearer from token
    token = token.replace('Bearer ', '')
    jwt.verify(token, config.get('jwt_token.secret'), (err, decoded) => {
      if (err && err.name === "TokenExpiredError") {
        return res.status(400).json({
          errors: [
            { msg: 'Token has been expired.' }
          ]
        })
      } else if (err) {
        return res.status(400).json({
          errors: [
            { msg: 'token is not valid.' }
          ]
        })
      } else {
        req.user = decoded
        return next();
      }
    })
  } else {
    res.json({
      errors: [
        { msg: 'authorization header is required.' }
      ]
    })
  }
}