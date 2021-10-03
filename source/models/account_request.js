const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Account_Type } = require('./account_type');

const Account_Request = sequelize.define(
    'account_request', {
        id_request:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        cui:{
            type: DataTypes.BIGINT,
            allowNull: false
        },
        account_type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Account_Type,
                key: 'id_account_type'
            }
        }
    }, {
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = {
    Account_Request
}