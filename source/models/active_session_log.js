const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');

const Active_Session_Log = sequelize.define(
    'active_session_log' , {
        token: {
            primaryKey: true,
            type: DataTypes.TEXT,
            allowNull: false
        },
        username: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true // Model tableName will be the same as the model name
    }
);

module.exports = {
    Active_Session_Log
}