const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Bank_User } = require("./bank_user");

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

//----------------------------------------------------------------------------
Bank_User.hasOne(Active_Session_Log,{foreignKey: 'username'});
Active_Session_Log.belongsTo(Bank_User,{foreignKey: 'username'});

module.exports = {
    Active_Session_Log
}