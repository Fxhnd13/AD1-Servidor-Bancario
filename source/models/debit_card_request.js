const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Account } = require("./account");
const { Request } = require('./request');

const Debit_Card_Request = sequelize.define(
    'debit_card_request', {
        id_request:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        id_account:{
            type: DataTypes.BIGINT,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    }
);

//----------------------------------------------------------------------------
Request.hasOne(Debit_Card_Request,{foreignKey: 'id_request'});
Debit_Card_Request.belongsTo(Request,{foreignKey: 'id_request'});
Account.hasMany(Debit_Card_Request,{foreignKey: 'id_account'});
Debit_Card_Request.belongsTo(Account,{foreignKey: 'id_account'});

module.exports = {
    Debit_Card_Request
}