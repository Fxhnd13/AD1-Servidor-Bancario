//https://sequelize.org/v3/docs/models-definition/

const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');

var Credit_Card_Type = sequelize.define(
    'credit_card_type', {
        id_credit_card_type:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        description:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        credit_limit:{
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        interest_rate:{
            type: DataTypes.DECIMAL,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true // Model tableName will be the same as the model name
    }
);

module.exports = {
    Credit_Card_Type
}