const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Person } = require('./person');
const { Account_Type } = require("./account_type");

var Account = sequelize.define(
    'account', {
        id_account: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        cui: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: Person,
                key: 'cui'
            }
        },
        id_account_type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Account_Type,
                key: 'id_account_type'
            }
        },
        balance:{
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0.0
        }
    }, {
        timestamps: false,
        freezeTableName: true, // Model tableName will be the same as the model name
        initialAutoIncrement: 100000000000
    }
);

module.exports = {
    Account
}