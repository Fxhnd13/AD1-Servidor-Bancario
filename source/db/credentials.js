const { Sequelize } = require('sequelize');

var sequelize = new Sequelize('bank_server', 'postgres', 'josecarlos', {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

module.exports = {
    sequelize
}