const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Account_Type } = require('./account_type');
const { Request } = require('./request');
const { Person } = require('./person');

const Account_Request = sequelize.define(
    'account_request', {
        id_request:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        cui:{
            type: DataTypes.BIGINT,
            allowNull: false
        },
        id_account_type: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    }
);

Request.hasOne(Account_Request,{foreignKey: 'id_request'});
Person.hasMany(Account_Request,{foreignKey: 'cui'});
Account_Type.hasMany(Account_Request,{foreignKey: 'id_account_type'});
Account_Request.belongsTo(Request,{foreignKey: 'id_request'});
Account_Request.belongsTo(Person,{foreignKey: 'cui'});
Account_Request.belongsTo(Account_Type,{foreignKey: 'id_account_type'});

module.exports = {
    Account_Request
}