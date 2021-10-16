//https://sequelize.org/v3/docs/models-definition/

const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Credit_Card } = require("./credit_card");

var Payment_Delay = sequelize.define(
    'payment_delay', {
        id_payment_delay:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        id_card:{
            type: DataTypes.BIGINT,
            allowNull: false,
            references:{
                model: Credit_Card,
                key: 'id_card'
            }
        },
        interest_rate:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        total_debt:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        canceled:{
            type: DataTypes.BOOLEAN,
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