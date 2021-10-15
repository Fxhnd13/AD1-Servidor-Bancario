//https://sequelize.org/v3/docs/models-definition/

const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Bank_User } = require('./bank_user');
const { Account } = require('./account');

var Deposit = sequelize.define(
    'deposit', {
        id_deposit:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        amount:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        destination_account:{
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: Account,
                key: 'id_account'
            }
        },
        responsible_username:{
            type: DataTypes.TEXT,
            allowNull: false,
            references: {
                model: Bank_User,
                key: 'username'
            }
        },
        date_time:{
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true // Model tableName will be the same as the model name
    }
);

module.exports = {
    Deposit
}