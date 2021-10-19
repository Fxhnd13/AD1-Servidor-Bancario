const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Account_Type } = require('./account_type');
const { Request } = require('./request');

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
        id_account_type: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = {
    Account_Request
}