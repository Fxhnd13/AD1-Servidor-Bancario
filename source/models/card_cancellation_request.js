const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Request } = require('./request');

const Card_Cancellation_Request = sequelize.define(
    'card_cancellation_request', {
        id_request: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        id_card: {
            type: DataTypes.BIGINT,
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
//----------------------------------------------------------------------------
Request.hasOne(Card_Cancellation_Request,{foreignKey: 'id_request'});
Card_Cancellation_Request.belongsTo(Request,{foreignKey: 'id_request'});

module.exports = {
    Card_Cancellation_Request
}