const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Person } = require('./person');

const Email = sequelize.define(
    'email', {
        cui: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            references: {
                model: Person,
                key: 'cui'
            }
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true // Model tableName will be the same as the model name
    }
);

module.exports = {
    Email
}