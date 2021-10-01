//https://sequelize.org/v3/docs/models-definition/

const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');

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
            allowNull: false
        },
        cui: {
            type: DataTypes.BIGINT,
            allowNull: false
            /* references: {
                model: Person,
                key: 'cui'
            } */
        }
    }, {
        timestamps: false,
        freezeTableName: true // Model tableName will be the same as the model name
    }
);

module.exports = {
    Bank_User
}