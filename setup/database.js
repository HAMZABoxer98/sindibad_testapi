const { sequelize } = require('../model/SequelizeConnection');

/**
 * Require all Models here
 **************************************************************/
const User = require('../model/UserModel');
/***************************************************************
 * Creating tables
 */
sequelize.sync();
