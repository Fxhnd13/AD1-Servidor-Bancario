const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');

const Bank_User_Type = sequelize.define(
    'bank_user_type', {
        id_bank_user_type: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true // Model tableName will be the same as the model name
    }
);

module.exports = {
    Bank_User_Type
}