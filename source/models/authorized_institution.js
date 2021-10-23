const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');

var Authorized_Institution = sequelize.define(
    'authorized_institution', {
        id_institution: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true, // Model tableName will be the same as the model name
    }
);

module.exports = {
    Authorized_Institution
}