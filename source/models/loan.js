//https://sequelize.org/v3/docs/models-definition/

const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Person } = require('./person');

var Loan = sequelize.define(
    'loan', {
        id_loan:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        cui:{
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: Person,
                key: 'cui'
            }
        },
        guarantor_cui:{
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: Person,
                key: 'cui'
            }
        },
        amount: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        balance:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        monthly_payment:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        interest_rate:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        cutoff_date:{
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        state:{
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true // Model tableName will be the same as the model name
    }
);

module.exports = {
    Loan
}