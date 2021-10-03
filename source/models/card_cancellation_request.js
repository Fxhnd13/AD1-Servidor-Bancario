const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Request } = require('./request');

const Card_Cancellation_Request = sequelize.define(
    'card_cancellation_request', {
        id_request: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: Request,
                key: 'id_request'
            }
        },
        id_card: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        type: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cause: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = {
    Card_Cancellation_Request
}