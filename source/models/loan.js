//https://sequelize.org/v3/docs/models-definition/

const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Person } = require('./person');
const { Account } = require("./account");

var Loan = sequelize.define(
    'loan', {
        id_loan:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        cui:{
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: Person,
                key: 'cui'
            }
        },
        guarantor_cui:{
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: Person,
                key: 'cui'
            }
        },
        id_account:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        amount: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        balance:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        monthly_payment:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        interest_rate:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        cutoff_date:{
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        creation_date:{
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: new Date(Date.now())
        },
        canceled:{ //activo/cancelado
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true // Model tableName will be the same as the model name
    }
);

Person.hasMany(Loan,{foreignKey: 'cui'});
Loan.belongsTo(Person,{foreignKey: 'cui'});
Person.hasMany(Loan,{foreignKey: 'guarantor_cui'});
Loan.belongsTo(Person,{foreignKey: 'guarantor_cui'});
Loan.belongsTo(Account,{foreignKey: 'id_account'});

module.exports = {
    Loan
}