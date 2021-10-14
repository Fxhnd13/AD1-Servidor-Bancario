//https://sequelize.org/v3/docs/models-definition/

const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Card } = require('./card');

var Card_Payment_Log = sequelize.define(
    'card_payment_log', {
        id_card_payment:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        id_card:{
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: Card,
                key: 'id_card'
            }
        },
        amount:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        date_time:{
            type: DataTypes.DATE,
            allowNull: false
        },
        description:{
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true // Model tableName will be the same as the model name
    }
);

module.exports = {
    Card_Payment_Log
}