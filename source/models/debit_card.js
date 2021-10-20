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
            allowNull: false
        },
        id_account:{
            type: DataTypes.BIGINT,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true // Model tableName will be the same as the model name
    }
);

//----------------------------------------------------------------------------
Card.hasOne(Debit_Card,{foreignKey: 'id_card'});
Debit_Card.belongsTo(Card,{foreignKey: 'id_card'});
Account.hasMany(Debit_Card,{foreignKey: 'id_account'});
Debit_Card.belongsTo(Account,{foreignKey: 'id_account'});

module.exports = {
    Debit_Card
}