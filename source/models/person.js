const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');

const Person = sequelize.define(
    'person' , {
        cui:{
            primaryKey: true,
            type: DataTypes.BIGINT,
            allowNull: false
        },
        name:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        surname:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        address:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        phone_number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        birth_day:{
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        gender: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        civil_status:{
            type: DataTypes.TEXT,
            allowNull: true
        },
        ocupation:{
            type: DataTypes.TEXT,
            allowNull: true
        },
        last_update_date:{
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true // Model tableName will be the same as the model name
    }
);

module.exports = {
    Person
}