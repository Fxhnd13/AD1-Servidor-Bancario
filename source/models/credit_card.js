//https://sequelize.org/v3/docs/models-definition/

const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Card } = require('./card');
const { Credit_Card_Type } = require('./credit_card_type');

var Credit_Card = sequelize.define(
    'credit_card', {
        id_card:{
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            references: {
                model: Card,
                key: 'id_card'
            }
        },
        credit_card_type:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Credit_Card_Type,
                key: 'id_credit_card_type'
            }
        },
        credit_limit:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        interest_rate:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        minimal_payment:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        payment:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        cutoff_date:{
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        balance:{
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        timestamps: false,
        freezeTableName: true // Model tableName will be the same as the model name
    }
);

module.exports = {
    Credit_Card
}