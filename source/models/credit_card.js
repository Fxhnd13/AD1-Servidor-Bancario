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
            allowNull: false
        },
        id_credit_card_type:{
            type: DataTypes.INTEGER,
            allowNull: false
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
        creation_date:{
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: new Date(Date.now())
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

//----------------------------------------------------------------------------
Card.hasOne(Credit_Card,{foreignKey: 'id_card'});
Credit_Card.belongsTo(Card,{foreignKey: 'id_card'});
Credit_Card_Type.hasMany(Credit_Card,{foreignKey: 'id_credit_card_type'});
Credit_Card.belongsTo(Credit_Card_Type,{foreignKey: 'id_credit_card_type'});

module.exports = {
    Credit_Card
}