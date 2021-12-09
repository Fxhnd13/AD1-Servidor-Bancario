//https://sequelize.org/v3/docs/models-definition/

const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Bank_User } = require('./bank_user');
const { Account } = require('./account');

var Deposit = sequelize.define(
    'deposit', {
        id_deposit:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        amount:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        destination_account:{
            type: DataTypes.BIGINT,
            allowNull: false
        },
        responsible_username:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        date_time:{
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true // Model tableName will be the same as the model name
    }
);
//----------------------------------------------------------------------------
Account.hasMany(Deposit,{foreignKey: 'destination_account'});
Deposit.belongsTo(Account,{foreignKey: 'destination_account'});
Bank_User.hasMany(Deposit,{foreignKey: 'responsible_username'});
Deposit.belongsTo(Bank_User,{foreignKey: 'responsible_username'});

module.exports = {
    Deposit
}