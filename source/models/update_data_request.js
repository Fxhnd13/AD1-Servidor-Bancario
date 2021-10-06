const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Request } = require('./request');
const { Person } = require("./person");

const Update_Data_Request = sequelize.define(
    'update_data_request', {
        id_request:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: Request,
                key: 'id_request'
            }
        },
        cui:{
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: Person,
                key: 'cui'
            }
        },
        address:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        phone_number:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        civil_status:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        ocupation:{
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = {
    Update_Data_Request
}