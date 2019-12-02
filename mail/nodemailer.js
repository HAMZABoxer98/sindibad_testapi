const nodemailer = require("nodemailer");
const config = require('config')
/**
mailObject should be like this
{
  from: '"Fred Foo 👻" <foo@example.com>', // sender address
  to: "bar@example.com, baz@example.com", // list of receivers
  subject: "Hello ✔", // Subject line
  text: "Hello world?", // plain text body
  html: "<b>Hello world?</b>" // html body
}
*/
async function sendMail(mailObject) {
  const transporter = nodemailer.createTransport(config.get('mail_config'));
  return await transporter.sendMail({
    ...mailObject,
    from: (mailObject.from || config.get('email'))
  });
}

module.exports = sendMail