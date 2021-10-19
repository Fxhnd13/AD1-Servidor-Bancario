//https://sequelize.org/v3/docs/models-definition/

const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Bank_User } = require('./bank_user');
const { Account } = require('./account');

var Withdrawal = sequelize.define(
    'withdrawal', {
        id_withdrawal:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        amount:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        origin_account:{
            type: DataTypes.BIGINT,
            allowNull: false
        },
        responsible_username:{
            type: DataTypes.TEXT,
            allowNull: false
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
    Withdrawal
}