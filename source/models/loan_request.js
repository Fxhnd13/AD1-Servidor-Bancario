const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Request } = require('./request');
const { Person } = require('./person');

const Loan_Request = sequelize.define(
    'loan_request', {
        id_request: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        cui:{
            type: DataTypes.BIGINT,
            allowNull: false
        },
        amount:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        monthly_income: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        cause: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        guarantor_cui: {
            type: DataTypes.BIGINT,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    }
);

//----------------------------------------------------------------------------
Request.hasOne(Loan_Request,{foreignKey: 'id_request'});
Loan_Request.belongsTo(Request,{foreignKey: 'id_request'});
Person.hasMany(Loan_Request,{foreignKey: 'cui'});
Loan_Request.belongsTo(Person,{foreignKey: 'cui'});
Person.hasMany(Loan_Request,{foreignKey: 'guarantor_cui'});
Loan_Request.belongsTo(Person,{foreignKey: 'guarantor_cui'});

module.exports = {
    Loan_Request
}