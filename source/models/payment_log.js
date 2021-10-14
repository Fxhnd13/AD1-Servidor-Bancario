//https://sequelize.org/v3/docs/models-definition/

const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Loan } = require('./loan');

var Payment_Log = sequelize.define(
    'payment_log', {
        id_payment:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        id_loan:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Loan,
                key: 'id_loan'
            }
        },
        payment_date:{
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        amount:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        balance:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        total_payment:{
            type: DataTypes.DECIMAL,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true // model tableName will be the same as the model name
    }
);

module.exports = {
    Payment_Log
}