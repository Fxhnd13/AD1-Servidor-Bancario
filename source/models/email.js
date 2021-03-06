const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Bank_User } = require("./bank_user");

const Email = sequelize.define(
    'email', {
        username: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true // Model tableName will be the same as the model name
    }
);
//----------------------------------------------------------------------------
Bank_User.hasOne(Email,{foreignKey: 'username'});
Email.belongsTo(Bank_User,{foreignKey: 'username'});

module.exports = {
    Email
}