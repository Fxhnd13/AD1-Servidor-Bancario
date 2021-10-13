//https://sequelize.org/v3/docs/models-definition/

const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Person } = require('./person');

var Payment_Delay = sequelize.define(
    'payment_delay', {
        id_payment_delay:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        cui:{
            type: DataTypes.BIGINT,
            allowNull: false,
            references:{
                model: Person,
                key: 'cui'
            }
        },
        interest_rate:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        last_date_charged:{
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        total_debt:{
            type: DataTypes.DECIMAL,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true // Model tableName will be the same as the model name
    }
);

module.exports = {
    Payment_Delay
}