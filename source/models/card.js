//https://sequelize.org/v3/docs/models-definition/

const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');

var Card = sequelize.define(
    'card', {
        id_card:{
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        pin:{
            type: DataTypes.STRING,
            allowNull: false
        },
        expiration_date:{
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true, // Model tableName will be the same as the model name
        initialAutoIncrement: 100000000000
    }
);

module.exports = {
    Card
}