# Build locally
1. clone this repository
2. create database `testapi`
3. npm install
4. npm run setup:database
5. nodemon start

# API
there is only two enpoints for now
* /api/v1/auth
  * /register
    * body: email, password, password_confirmation
  * /login
    * body: email: password

# URLs
* /auth
  * /register
  * /confirm/email
  * /confirm/email?token=...