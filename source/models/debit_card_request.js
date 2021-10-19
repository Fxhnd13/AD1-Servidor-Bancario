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

module.exports = {
    Debit_Card_Request
}