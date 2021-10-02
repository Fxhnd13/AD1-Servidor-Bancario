const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Request } = require('./request');
const { Person } = require('./person');

const Credit_Card_Request = sequelize.define(
    'credit_card_request', {
        id_request: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: Request,
                key: 'id_request'
            }
        },
        cui: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: Person,
                key: 'cui'
            }
        },
        monthly_income: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        desire_amount: {
            type: DataTypes.DECIMAL,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true // Model tableName will be the same as the model name
    }
);

module.exports = {
    Credit_Card_Request
}