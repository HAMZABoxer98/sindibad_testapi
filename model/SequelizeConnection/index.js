const Sequelize = require('sequelize');
const config = require('config')

const sequelize = new Sequelize(config.get('mysql_db'), config.get('mysql_user'), config.get('mysql_password'), {
  dialect: 'mysql'
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Sequelize MySQL - Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    throw err;
    process.exit(1);
  });

module.exports = {
  Sequelize, sequelize
};