const { sequelize } = require("../db/credentials");
const { DataTypes } = require('sequelize');
const { Request } = require('./request');
const { Person } = require("./person");

const Update_Data_Request = sequelize.define(
    'update_data_request', {
        id_request:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        cui:{
            type: DataTypes.BIGINT,
            allowNull: false
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
//----------------------------------------------------------------------------
Request.hasOne(Update_Data_Request,{foreignKey: 'id_request'});
Update_Data_Request.belongsTo(Request,{foreignKey: 'id_request'});
Person.hasMany(Update_Data_Request,{foreignKey: 'cui'});
Update_Data_Request.belongsTo(Person,{foreignKey: 'cui'});

module.exports = {
    Update_Data_Request
}