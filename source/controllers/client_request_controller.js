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
const { Card } = require("../models/card");
const { Person } = require("../models/person");
const { print_request_type, get_credit_score } = require("./utilities_controller");
const { request } = require("express");
const { Account } = require("../models/account");

/**
 * @description Method that creates a update data request
 * @param id_request Number of request
 * @param cui Identification to the person who wants to be updated
 * @param req.body.address Information to be updated
 * @param req.body.phone_number Information to be updated
 * @param req.body.civil_status Information to be updated
 * @param req.body.ocupation Information to be updated
 */
const create_update_data_request = (req, res) => {
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session=>{
        if(session == null){
            res.status(401).json({information_message: 'El token de sesion ha expirado, inicie sesión nuevamente.'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true }).then(bank_user=>{
                Request.create({ request_type: 1, date: new Date(Date.now()), verified: false}).then(new_request =>{
                    if(new_request != null){
                        Update_Data_Request.create({
                            id_request: new_request.id_request,
                            cui: bank_user.cui,
                            address: req.body.address,
                            phone_number: req.body.phone_number,
                            civil_status: req.body.civil_status,
                            ocupation: req.body.ocupation
                        }).then(()=> {
                            res.status(200).json({information_message:'Se ha creado una solicitud de actualización de datos.'});
                        });
                    }
                });
            });
        }
    });
};

/**
 * @description Method that creates a card cancellation request
 * @param id_request Number of request
 * @param req.body.id_card Identification of the card to be cancelled
 * @param req.body.type Type of card (credit=0/debit=1)
 * @param req.body.cause Cause of cancellation
 */
const create_card_cancellation_request = (req, res) => {
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session=>{
        if(session == null){
            res.status(401).json({information_message: 'El token de sesion ha expirado, inicie sesión nuevamente.'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true }).then(bank_user=>{
                Card.findOne({where: {id_card: req.body.id_card}, raw: true}).then(card=>{
                    if(card.cui == bank_user.cui){
                        Request.create({ request_type: 2, date: new Date(Date.now()), verified: false}).then(new_request =>{
                            if(new_request != null){
                                Card_Cancellation_Request.create({
                                    id_request: new_request.id_request,
                                    id_card: req.body.id_card,
                                    cause: req.body.cause
                                }).then(()=> {
                                    res.status(200).json({information_message:'Se ha creado una solicitud de cancelacion de tarjeta.'});
                                });
                            }
                        });
                    }else{
                        res.status(403).json({information_message: 'No puede solicitar la cancelacion de una tarjeta que no le pertenece.'});
                    }
                });
            });
        }
    });
}

/**
 * @description Method that creates a credit card request
 * @param id_request Number of request
 * @param cui Identification of the person who made the request
 * @param req.body.monthly_income Monthly income of the person who create the request
 * @param req.body.desire_amount Desire amount for the credit card
 */
const create_credit_card_request = (req, res) => {
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session=>{
        if(session == null){
            res.status(401).json({information_message: 'El token de sesion ha expirado, inicie sesión nuevamente.'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true }).then(bank_user=>{
                Request.create({ request_type: 3, date: new Date(Date.now()), verified: false}).then(new_request =>{
                    if(new_request != null){
                        Credit_Card_Request.create({
                            id_request: new_request.id_request,
                            cui: bank_user.cui,
                            monthly_income: req.body.monthly_income,
                            desire_amount: req.body.desire_amount
                        }).then(()=> {
                            res.status(200).json({information_message:'Se ha creado una solicitud de tarjeta de credito.'});
                        });
                    }
                });
            });
        }
    });
}

/**
 * @description Method that creates a debit card request
 * @param id_request Number of request
 * @param req.body.id_account Linked account
 */
const create_debit_card_request = (req, res) => {
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session=>{
        if(session == null){
            res.status(401).json({information_message: 'El token de sesion ha expirado, inicie sesión nuevamente.'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true }).then(bank_user=>{
                Account.findOne({where: {id_account: req.body.id_account}, raw: true}).then(account=>{
                    if(account == null){
                        res.status(403).json({information_message: 'No existe una cuenta con el identificador indicado'});
                    }else{
                        if(bank_user.cui == account.cui){
                            Request.create({ request_type: 4, date: new Date(Date.now()), verified: false}).then(new_request =>{
                                if(new_request != null){
                                    Debit_Card_Request.create({
                                        id_request: new_request.id_request,
                                        id_account: req.body.id_account
                                    }).then(()=> {
                                        res.status(200).json({information_message:'Se ha creado una solicitud de tarjeta de debito.'});
                                    });
                                } 
                            });
                        }else{
                            res.status(403).json({information_message: 'No puede solicitar una tarjeta de debito para una cuenta que no le pertenece.'});
                        }
                    }
                });
            });
        }
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
const create_loan_request = (req, res) => {
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session=>{
        if(session == null){
            res.status(401).json({information_message: 'El token de sesion ha expirado, inicie sesión nuevamente.'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true }).then(bank_user=>{
                Person.findOne({where: {cui: req.body.guarantor_cui}, raw: true}).then(guarantor=>{
                    if(guarantor == null){
                        res.status(403).json({information_message: 'No existe la información relacionada al cui del fiador enviado.'})
                    }else{
                        if(bank_user.cui == guarantor.cui){
                            res.status(403).json({information_message: 'No puede ser el solcitante y el fiador a la vez.'})
                        }else{
                            Request.create({ request_type: 5, date: new Date(Date.now()), verified: false}).then(new_request =>{
                                if(new_request != null){
                                    Loan_Request.create({
                                        id_request: new_request.id_request,
                                        cui: bank_user.cui,
                                        amount: req.body.amount,
                                        monthly_income: req.body.monthly_income,
                                        cause: req.body.cause,
                                        guarantor_cui: req.body.guarantor_cui
                                    }).then(()=> {
                                        res.status(200).json({information_message:'Se ha creado una solicitud de prestamo bancario.'});
                                    });
                                }
                            });   
                        }
                    }
                });
            });
        }
    });
}

/**
 * @description Method that creates an account request
 * @param id_request Number of request
 * @param cui Identification of the person who made the request
 * @param req.body.account_type Type of account
 */
const create_account_request = (req, res) => {
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session=>{
        if(session == null){
            res.status(401).json({information_message: 'El token de sesion ha expirado, inicie sesión nuevamente.'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true }).then(bank_user=>{
                Request.create({ request_type: 6, date: new Date(Date.now()), verified: false}).then(new_request =>{
                    if(new_request != null){
                        Account_Request.create({
                            id_request: new_request.id_request,
                            cui: bank_user.cui,
                            id_account_type: req.body.account_type
                        }).then(()=> {
                            res.status(200).json({information_message:'Se ha creado una solicitud de creacion de cuenta.'});
                        });
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
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session=>{
        if(session == null){
            res.status(401).json({information_message: 'El token de sesion ha expirado, inicie sesión nuevamente.'});
        }else{
            Request.findAll({where: {verified: false}, raw: true, order: [['date', 'ASC']]}).then(requests => {
                var result = [];
                requests.forEach(request=>{
                    result.push({id_request:request.id_request, request_type: print_request_type(request.request_type), date: request.date, verified: request.verified});
                })
                res.status(200).json(result);
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
            Request.findAll({
                where:{
                    date: {
                        [Op.gte]: req.query.initial_date,
                        [Op.lte]: req.query.final_date
                    },
                    verified: false
                },
                order: [['date', 'ASC']]
            }).then(requests => {
                var result = [];
                requests.forEach(request=>{
                    result.push({id_request:request.id_request, request_type: print_request_type(request.request_type), date: request.date, verified: request.verified});
                })
                res.status(200).json(result);
            });
        }
    });
};

const get_request_by_id = (req, res) =>{
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session =>{
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user=>{
                if(bank_user.user_type > 2){
                    Request.findOne({where:{id_request: req.query.id_request}, raw: true}).then(request=>{
                        var request_data_promise, credit_score_promise=null;
                        switch(request.request_type){
                            case 1:{
                                request_data_promise = Update_Data_Request.findOne({where:{id_request: request.id_request}, raw: true});
                                break;
                            }
                            case 2:{
                                request_data_promise = Card_Cancellation_Request.findOne({where:{id_request: request.id_request}, raw: true});
                                break;
                            }
                            case 3:{
                                request_data_promise = Credit_Card_Request.findOne({where:{id_request: request.id_request}, raw: true});
                                credit_score_promise = get_credit_score(0);
                                break;
                            }
                            case 4:{
                                request_data_promise = Debit_Card_Request.findOne({where:{id_request: request.id_request}, raw: true});
                                break;
                            }
                            case 5:{
                                request_data_promise = Loan_Request.findOne({where:{id_request: request.id_request}, raw: true});
                                credit_score_promise = get_credit_score(0);
                                break;
                            }
                            case 6:{
                                request_data_promise = Account_Request.findOne({where:{id_request: request.id_request}, raw: true});
                                break;
                            }
                            default:{
                                res.status(500).json({information_message: 'Tipo de solicitud sin identificar.'});
                                break;
                            }
                        }
                        request_data_promise.then(data=>{
                            if(credit_score_promise != null){
                                credit_score_promise.then(credit_score=>{
                                    res.status(200).json({
                                        id_request: request.id_request,
                                        request_type: print_request_type(request.request_type),
                                        credit_score: credit_score,
                                        request_data: data
                                    });
                                });
                            }else{
                                res.status(200).json({
                                    id_request: request.id_request,
                                    request_type: print_request_type(request.request_type),
                                    request_data: data
                                });
                            }
                        });
                    });
                }else{
                    res.status(403).json({information_message:'No posee permisos para acceder a esta información.'});
                }
            });
        }
    })
};

const deny_request = (req, res) =>{
    Active_Session_Log.findOne({where:{token: req.headers.token}, raw: true}).then(session=>{
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user=>{
                if(bank_user.user_type > 2){
                    Request.findOne({where: {id_request: req.body.id_request}}).then(request=>{
                        request.update({verified: true});
                    }).then(()=>{
                        send_denying_email(request);
                        res.status(200).json({information_message: 'Se ha rechazado la solicitud exitosamente'});
                    });
                }else{
                    res.status(403).json({information_message: 'No posee permisos para realizar esta ación'});
                }
            })
        }
    })
};

module.exports = {
    create_account_request,
    create_card_cancellation_request,
    create_credit_card_request,
    create_debit_card_request,
    create_update_data_request,
    create_loan_request,
    get_all_request,
    get_request_between_two_dates,
    get_request_by_id,
    deny_request
}