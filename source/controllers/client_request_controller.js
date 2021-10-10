const { sequelize } = require("../db/credentials");
const { Account_Request } = require("../models/account_request");
const { Active_Session_Log } = require("../models/active_session_log");
const { Bank_User } = require("../models/bank_user");
const { Card_Cancellation_Request } = require("../models/card_cancellation_request");
const { Credit_Card_Request } = require('../models/credit_card_request');
const { Debit_Card_Request } = require("../models/debit_card_request");
const { Loan_Request } = require("../models/loan_request");
const { Request } = require("../models/request");
const { Update_Data_Request } = require("../models/update_data_request");
const { Op } = require('sequelize');

/**
 * @description Method that creates a update data request
 * @param id_request Number of request
 * @param cui Identification to the person who wants to be updated
 * @param req.body.address Information to be updated
 * @param req.body.phone_number Information to be updated
 * @param req.body.civil_status Information to be updated
 * @param req.body.ocupation Information to be updated
 */
function update_data_request(req, res, id_request, cui){
    Update_Data_Request.create({
        id_request: id_request,
        cui: cui,
        address: req.body.address,
        phone_number: req.body.phone_number,
        civil_status: req.body.civil_status,
        ocupation: req.body.ocupation
    }).then(()=> {
        res.status(200).json({information_message:'Se ha creado una solicitud de actualización de datos.'});
    });
}

/**
 * @description Method that creates a card cancellation request
 * @param id_request Number of request
 * @param req.body.id_card Identification of the card to be cancelled
 * @param req.body.type Type of card (credit=0/debit=1)
 * @param req.body.cause Cause of cancellation
 */
function card_cancellation_request(req, res, id_request){
    Card_Cancellation_Request.create({
        id_request: id_request,
        id_card: req.body.id_card,
        type: req.body.type,
        cause: req.body.cause
    }).then(()=> {
        res.status(200).json({information_message:'Se ha creado una solicitud de cancelacion de tarjeta.'});
    });
}

/**
 * @description Method that creates a credit card request
 * @param id_request Number of request
 * @param cui Identification of the person who made the request
 * @param req.body.monthly_income Monthly income of the person who create the request
 * @param req.body.desire_amount Desire amount for the credit card
 */
function credit_card_request(req, res, id_request, cui){
    Credit_Card_Request.create({
        id_request: id_request,
        cui: cui,
        monthly_income: req.body.monthly_income,
        desire_amount: req.body.desire_amount
    }).then(()=> {
        res.status(200).json({information_message:'Se ha creado una solicitud de tarjeta de credito.'});
    });
}

/**
 * @description Method that creates a debit card request
 * @param id_request Number of request
 * @param req.body.id_account Linked account
 */
function debit_card_request(req, res, id_request, cui){
    Debit_Card_Request.create({
        id_request: id_request,
        id_account: req.body.id_account
    }).then(()=> {
        res.status(200).json({information_message:'Se ha creado una solicitud de tarjeta de debito.'});
    });
}

/**
 * @description Method that creates a loan request
 * @param id_request Number of request
 * @param cui Identification of the person who made the request
 * @param req.body.amount Desire amount
 * @param req.body.monthly_income Monthly income of the person who made the request
 * @param req.body.cause Cause of the loan
 * @param req.body.guarantor_cui Identification of the guarantor
 */
function loan_request(req, res, id_request, cui){
    Loan_Request.create({
        id_request: id_request,
        cui: cui,
        amount: req.body.amount,
        monthly_income: req.body.monthly_income,
        cause: req.body.cause,
        guarantor_cui: req.body.guarantor_cui
    }).then(()=> {
        res.status(200).json({information_message:'Se ha creado una solicitud de prestamo bancario.'});
    });
}

/**
 * @description Method that creates an account request
 * @param id_request Number of request
 * @param cui Identification of the person who made the request
 * @param req.body.account_type Type of account
 */
function account_request(req, res, id_request, cui){
    Account_Request.create({
        id_request: id_request,
        cui: cui,
        account_type: req.body.account_type
    }).then(()=> {
        res.status(200).json({information_message:'Se ha creado una solicitud de creacion de cuenta.'});
    });
}

/**
 * @description Method that verifies the authentication and create a request
 * @param req.body.request_type Type of the request
 */
const create_request = (req, res) => {
    //Active_Session_Log.findOne({where: {token: req.body.token }, raw: true}).then(session =>{
    Active_Session_Log.findOne({where: {token: req.headers.token}}).then(session=>{
        if(session == null){
            res.status(401).json({information_message: 'El token de sesion ha expirado, inicie sesión nuevamente.'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true }).then(bank_user=>{
                Request.create({ request_type: req.body.request_type, date: sequelize.fn('NOW')}).then(new_request =>{
                    if(req.body.request_type == 'update_data'){
                        update_data_request(req, res, new_request.id_request, bank_user.cui);
                    }else if(req.body.request_type == 'card_cancellation'){
                        card_cancellation_request(req, res, new_request.id_request, bank_user.cui);
                    }else if(req.body.request_type == 'credit_card'){
                        credit_card_request(req, res, new_request.id_request, bank_user.cui);
                    }else if(req.body.request_type == 'debit_card'){
                        debit_card_request(req, res, new_request.id_request, bank_user.cui);
                    }else if(req.body.request_type == 'loan'){
                        loan_request(req, res, new_request.id_request, bank_user.cui);
                    }else if(req.body.request_type == 'account'){
                        account_request(req, res, new_request.id_request, bank_user.cui);
                    }else{
                        res.status(403).json({information_message: 'No existe el tipo de solicitud que realizó.'});
                    }
                });
            });
        }
    });
};

/**
 * @description Method that return a json with all created request
 */
const get_all_request = (req, res) =>{
    //Active_Session_Log.findOne({where: {token: req.body.token }}).then(session =>{
    Active_Session_Log.findOne({where: {token: req.headers.token}}).then(session=>{
        if(session == null){
            res.status(401).json({information_message: 'El token de sesion ha expirado, inicie sesión nuevamente.'});
        }else{
            Request.findAll({raw: true}).then(requests => {
                res.status(200).json(requests);
            });
        }
    });
};

/**
 * @description Method that return a json with all created request between two dates
 */
const get_request_between_two_dates = (req, res) =>{
    //Active_Session_Log.findOne({where: {token: req.body.token }}).then(session =>{
    Active_Session_Log.findOne({where: {token: req.headers.token}}).then(session=>{
        if(session == null){
            res.status(401).json({information_message: 'El token de sesion ha expirado, inicie sesión nuevamente.'});
        }else{
            console.log("Fecha inicial: "+req.body.initial_date);
            console.log("Fecha Final: "+req.body.final_date);
            Request.findAll({
                where:{
                    date: {
                        [Op.gte]: req.body.initial_date,
                        [Op.lte]: req.body.final_date
                    }
                },
                order: [['date', 'DESC']]
            }).then(requests => {
                res.status(200).json(requests);
            });
        }
    });
};

module.exports = {
    create_request,
    get_all_request,
    get_request_between_two_dates
}