//https://sequelize.org/v3/docs/models-definition/

const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Card } = require('./card');
const { Account } = require('./account');

var Debit_Card = sequelize.define(
    'debit_card', {
        id_card:{
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            references: {
                model: Card,
                key: 'id_card'
            }
        },
        id_account:{
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                Model: Account,
                key: 'id_account'
            }
        }
    }, {
        timestamps: false,
        freezeTableName: true // Model tableName will be the same as the model name
    }
);

module.exports = {
    Debit_Card
}