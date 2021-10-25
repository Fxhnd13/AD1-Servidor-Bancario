const { Bank_User } = require("../models/bank_user");
const { Active_Session_Log } = require('../models/active_session_log');
const { Card } = require('../models/card');
const { Credit_Card } = require('../models/credit_card');
const { Debit_Card } = require('../models/debit_card');
const { Account } = require('../models/account');
const { Card_Payment_Log } = require('../models/card_payment_log');
const { sequelize } = require("../db/credentials");
const { Payment_Delay } = require("../models/payment_delay");
const { get_random_int, MS_FOR_ONE_YEAR, CARD_OFFSET, plus_card_offset } = require('./utilities_controller');
const { Credit_Card_Type } = require("../models/credit_card_type");
const { send_card_aprovement_email } = require('./email_controller');
const { Authorized_Institution } = require('../models/authorized_institution');
const bcrypt = require("bcrypt");

const card_statement = (req, res) => {
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session => {
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente.'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user =>{
                Card.findOne({where: {id_card: req.query.id_card}, raw: true}).then(card =>{
                    if((card.cui == bank_user.cui) || (bank_user.user_type > 2)){
                        if(card.card_type == 1){
                            credit_card_statement(req, res, session);
                        }else if(card.card_type == 2){
                            debit_card_statement(req, res, session);
                        }else{
                            res.status(403).json({information_message: 'No existe el tipo de tarjeta solicitado.'});
                        }
                    }else{
                        res.status(403).json({information_message: 'No tiene acceso a esta información, la tarjeta solicitada no le pertenece.'});
                    }
                });
            });
        }
    });
};

const credit_card_statement = (req, res, session) => {
    Credit_Card.findOne({where : {id_card: req.query.id_card}, raw: true}).then(credit_card => {
        Card_Payment_Log.findAll({where: {id_card: credit_card.id_card}, raw: true}).then(payments =>{
            Payment_Delay.findAll({where: {id_card: credit_card.id_card}, raw: true}).then(payments_delayed =>{
                res.status(200).json({
                    id_card: credit_card.id_card,
                    cui: credit_card.cui,
                    credit_card_type: credit_card.credit_card_type,
                    credit_limit: credit_card.credit_limit,
                    interest_rate: credit_card.interest_rate,
                    cutoff_date: credit_card.cutoff_date,
                    balance: credit_card.balance,
                    payments: payments,
                    payments_delayed: payments_delayed
                });
            });
        });
    });
};

const debit_card_statement = (req, res, session) => {
    Debit_Card.findOne({where: {id_card: req.query.id_card}, raw: true}).then(debit_card =>{
        Account.findOne({where: {id_account: debit_card.id_account}, raw: true}).then(account => {
            Card_Payment_Log.findAll({where: {id_card: debit_card.id_card}, raw: true}).then(payments =>{
                res.status(200).json({
                    id_card: debit_card.id_card,
                    cui: account.cui,
                    id_account: debit_card.id_account,
                    balance: account.balance,
                    payments: payments
                });
            });
        });
    });
};

const credit_card_verfication = ()=>{
    const actual_date = new Date(Date.now());
    Credit_Card.findAll({where: {cutoff_date: actual_date}}).then(credit_cards=>{
        credit_cards.forEach(credit_card => {
            actual_date = plus_one_month(actual_date);
            credit_card.cutoff_date = actual_date;
            if(parseFloat(credit_card.payment) >= (parseFloat(credit_card.balance)*parseFloat(credit_card.minimal_payment))){
                credit_card.balance = parseFloat(credit_card.balance) - parseFloat(credit_card.payment);
            }else{
                Payment_Delay.create({
                    cui: credit_card.cui,
                    interest_rate: credit_card.interest_rate,
                    total_debt: credit_card.balance,
                    canceled: false
                });
                credit_card.balance = 0;
            }
            credit_card.payment = 0;
            credit_card.save();
        });
    });
};

const card_cancellation = (req, res) => {
    Active_Session_Log.findOne({where:{token: req.headers.token},raw: true}).then(session=>{
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente'});
        }else{
            Bank_User.findOne({where:{username: session.username}, raw: true}).then(bank_user=>{
                if(bank_user.user_type > 2){
                    Payment_Delay.findAll({where:{id_card: req.body.id_card}, raw: true}).them(payments_delayed=>{
                        if(payments_delayed.length > 0){
                            res.status(403).json({information_message: 'No se puede cancelar la tarjeta solicitada, posee saldos pendientes.'});
                        }else{
                            Request.findOne({where:{id_request: req.body.id_request}}).then(request=>{
                                request.update({verified: true});
                            });
                            Card.findOne({where: {id_card: req.body.id_card}}).then(card=>{
                                card.update({active: false});
                                res.status(200).json({information_message:'Se ha cancelado la tarjeta solicitada con éxito.'});
                            });
                        }
                    });
                }else{
                    res.status(403).json({information_message: 'No posee permiso para realizar esta acción.'});
                }
            });
        }
    });
};

const create_card = (req, res) =>{
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session =>{
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user=>{
                if(bank_user.user_type > 2){
                    if(req.body.id_request != undefined){
                        Request.findOne({where: {id_request: req.body.id_request}}).then(request=>{
                            request.update({verified: true});
                        });
                        Card.count().then(value=>{
                            Card.create({
                                id_card: plus_card_offset(value),
                                cui: req.body.cui,
                                card_type: req.body.card_type,
                                pin: get_random_int(1000,9999),
                                expiration_date: new Date(Date.now()+(MS_FOR_ONE_YEAR*5)),
                                active: true
                            }).then(card=>{
                                if(card_type == 1){
                                    create_credit_card(card, req, res);
                                }else{
                                    create_debit_card(card, req, res);
                                }
                                send_card_aprovement_email(session.username, card);
                            });
                        });
                    }
                }else{
                    res.status(403).json({information_message: 'No posee permisos para realizar esta acción.'});
                }
            })
        }
    })
};

const create_credit_card = (card, req, res) => {
    Credit_Card_Type.findOne({where: {id_credit_card_type: req.body.id_credit_card_type}, raw: true}).then(credit_card_type=>{
        Credit_Card.create({
            id_card: card.id_card,
            id_credit_card_type: credit_card_type.id_credit_card_type,
            credit_limit: credit_card_type.credit_limit,
            interest_rate: credit_card_type.interest_rate,
            minimal_payment: req.body.minimal_payment,
            payment: 0,
            cutoff_date: req.body.cutoff_date,
            creation_date: new Date(Date.now()),
            balance: 0
        }).then(() =>{
            res.status(200).json({information_message: 'Se ha creado la tarjeta de credito con éxito'});
        });
    });
};

const create_debit_card = (card, req, res) => {
    Debit_Card.create({
        id_card: card.id_card,
        id_account: req.body.id_account
    }).then(()=>{
        res.status(200).json({information_message: 'Se ha creado una tarjeta de debito con éxito'});
    });
};

function charge_in_credit_card(id_card, institution, req, res){
    Credit_Card.findOne({where: {id_card: id_card}}).then(credit_card=>{
        if((parseFloat(credit_card.balance)+parseFloat(req.body.amount)) <= parseFloat(credit_card.credit_limit)){
            Card_Payment_Log.create({
                id_card: id_card,
                amount: req.body.amount,
                date_time: new Date(Date.now()),
                description: institution.name+" "+req.body.description
            });
            credit_card.update({balance: parseFloat(credit_card.balance) + parseFloat(req.body.amount)});
            res.status(200).json({information_message: 'Se ha realizado el cobro con éxito'});
        }else{
            res.status(404).json({information_message: 'La tarjeta ingresada no posee fondos suficientes.'});
        }
    });
};

function charge_in_debit_card(id_card, institution, req, res){
    Debit_Card.findOne({where:{id_card: id_card}, raw: true}).then(debit_card=>{
        Account.findOne({where: {id_account: debit_card.id_account}}).then(account=>{
            if(parseFloat(account.balance) >= parseFloat(req.body.amount)){
                Card_Payment_Log.create({
                    id_card: id_card,
                    amount: req.body.amount,
                    date_time: new Date(Date.now()),
                    description: institution.name+" "+req.body.description
                });
                account.update({balance: parseFloat(account.balance) - parseFloat(req.body.amount)});
                res.status(200).json({information_message: 'Se ha realizado el cobro con éxito'});
            }else{
                res.status(404).json({information_message: 'La tarjeta ingresada no posee fondos suficientes'});
            }
        });
    });
};

//id_institution,password,id_card,amount,description
const do_payment = (req, res) =>{
    Authorized_Institution.findOne({where: {id_institution: req.body.id_institution, password: req.body.password}, raw: true}).then(institution=>{
        if(institution == null){
            res.status(401).json({information_message: 'No es una institución autorizada para realizar cobros utilizando este metodo.'});
        }else{
            bcrypt.compare(req.body.password,institution.password).then(areEqual =>{
                if(areEqual){
                    Card.findOne({where: {id_card: req.body.id_card}, raw: true}).then(card=>{
                        if(card == null){
                            res.status(404).json({information_message: 'No existe la tarjeta de credito enviada.'});
                        }else{
                            if(card.active){
                                if(card.expiration_date.getTime() < Date.now()){
                                    res.status(403).json({information_message: 'La tarjeta seleccionada ha expirado, no se pueden realizar transacciones.'});
                                }else{
                                    if(card.card_type == 1){
                                        charge_in_credit_card(id_card, institution, req, res);
                                    }else{
                                        charge_in_debit_card(id_card, institution, req, res);
                                    }
                                }
                            }else{
                                res.status(403).json({information_message: 'La tarjeta seleccionada ya no se encuentra activa.'});
                            }
                        }
                    });
                }else{
                    res.status(403).json({information_message:"La contraseña proporcionada no es la correcta."});
                }
            });
        }
    });
};

module.exports = {
    card_statement,
    credit_card_verfication,
    card_cancellation,
    create_card,
    do_payment
}