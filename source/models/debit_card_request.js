const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Account } = require("./account");
const { Request } = require('./request');

const Debit_Card_Request = sequelize.define(
    'debit_card_request', {
        id_request:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: Request,
                key: 'id_request'
            }
        },
        id_account:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Account,
                key: 'id_account'
            }
        }
    }, {
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = {
    Debit_Card_Request
}