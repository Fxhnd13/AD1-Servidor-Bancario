//https://sequelize.org/v3/docs/models-definition/

const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Person } = require('./person');

var Card = sequelize.define(
    'card', {
        id_card:{
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        cui:{
            type: DataTypes.BIGINT,
            allowNull: false
        },
        card_type:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        pin:{
            type: DataTypes.STRING,
            allowNull: false
        },
        expiration_date:{
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        active:{
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true, // Model tableName will be the same as the model name
        initialAutoIncrement: 100000000000
    }
);

//----------------------------------------------------------------------------
Person.hasMany(Card,{foreignKey: 'cui'});
Card.belongsTo(Person,{foreignKey: 'cui'});

module.exports = {
    Card
}