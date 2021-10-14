//https://sequelize.org/v3/docs/models-definition/

const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Account } = require('./account');
const { send_deposit_email, send_withdrawal_email } = require('../controllers/email_controller');
const { Email } = require("./email");

var Transfer = sequelize.define(
    'transfer', {
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
            allowNull: false,
            references: {
                model: Account,
                key: 'id_account'
            }
        },
        destination_account:{
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: Account,
                key: 'id_account'
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
    Transfer
}