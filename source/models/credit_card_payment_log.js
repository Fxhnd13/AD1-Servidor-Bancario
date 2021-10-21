//https://sequelize.org/v3/docs/models-definition/

const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Credit_Card } = require('./credit_card');

var Credit_Card_Payment_Log = sequelize.define(
    'credit_card_payment_log', {
        id_payment:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        id_card:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        date:{
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        amount:{
            type: DataTypes.DECIMAL,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true // model tableName will be the same as the model name
    }
);
//----------------------------------------------------------------------------
Credit_Card.hasMany(Credit_Card_Payment_Log,{foreignKey: 'id_card'});
Credit_Card_Payment_Log.belongsTo(Credit_Card,{foreignKey: 'id_card'});

module.exports = {
    Credit_Card_Payment_Log
}