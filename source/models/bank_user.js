//https://sequelize.org/v3/docs/models-definition/

const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Person } = require('./person');
const { Bank_User_Type } = require('./bank_user_type');

var Bank_User = sequelize.define(
    'bank_user', {
        username: {
            primaryKey: true,
            type: DataTypes.TEXT,
            allowNull: false
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        user_type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Bank_User_Type,
                key: 'id_bank_user_type'
            }
        },
        cui: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: Person,
                key: 'cui'
            }
        },
        access: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true // Model tableName will be the same as the model name
    }
);

module.exports = {
    Bank_User
}