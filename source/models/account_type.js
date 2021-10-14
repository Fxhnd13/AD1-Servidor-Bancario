const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');

const Account_Type = sequelize.define(
    'account_type', {
        id_account_type: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        interest_rate: {
            type: DataTypes.DECIMAL,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true // Model tableName will be the same as the model name
    }
);

module.exports = {
    Account_Type
}