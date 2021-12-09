const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Request } = require('./request');
const { Person } = require('./person');

const Credit_Card_Request = sequelize.define(
    'credit_card_request', {
        id_request: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        cui: {
            type: DataTypes.BIGINT,
            allowNull: false
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

//----------------------------------------------------------------------------
Request.hasOne(Credit_Card_Request,{foreignKey: 'id_request'});
Credit_Card_Request.belongsTo(Request,{foreignKey: 'id_request'});
Person.hasMany(Credit_Card_Request,{foreignKey: 'cui'});
Credit_Card_Request.belongsTo(Person,{foreignKey: 'cui'});

module.exports = {
    Credit_Card_Request
}