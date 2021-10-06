const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Bank_User } = require("./bank_user");

const Bank_User_Status_Log = sequelize.define(
    'bank_user_status_log', {
        id_bank_user_status_log: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        access: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        username: {
            type: DataTypes.TEXT,
            allowNull: false,
            references: {
                model: Bank_User,
                key: 'username'
            }
        }
    }, {
        timestamps: false,
        freezeTableName: true // Model tableName will be the same as the model name
    }
);

module.exports = {
    Bank_User_Status_Log
}