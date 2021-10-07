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

/* var sequelize = new Sequelize(
        'd9n5uc8j2k3lad',
        'sxningfregfomg', 
        'c202177f18da3a3ca4189e49042aa8119c26137ed45568d0b6a79ad399d39e84', {
    host: 'ec2-54-145-110-118.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
}); */

module.exports = {
    sequelize
}