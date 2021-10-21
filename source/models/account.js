const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Person } = require('./person');
const { Account_Type } = require("./account_type");

var Account = sequelize.define(
    'account', {
        id_account: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        cui: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        id_account_type: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        balance:{
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0.0
        }
    }, {
        timestamps: false,
        freezeTableName: true, // Model tableName will be the same as the model name
        initialAutoIncrement: 100000000000
    }
);

//----------------------------------------------------------------------------
Person.hasMany(Account,{foreignKey: 'cui'});
Account_Type.hasMany(Account,{foreignKey: 'id_account_type'});
Account.belongsTo(Person,{foreignKey: 'cui'});
Account.belongsTo(Account_Type,{foreignKey: 'id_account_type'});

module.exports = {
    Account
}