const { Bank_User } = require("../models/bank_user");
const { Active_Session_Log } = require('../models/active_session_log');
const { Card } = require('../models/card');
const { Credit_Card } = require('../models/credit_card');
const { Debit_Card } = require('../models/debit_card');
const { Account } = require('../models/account');
const { Card_Payment_Log } = require('../models/card_payment_log');
const { sequelize } = require("../db/credentials");
const { Payment_Delay } = require("../models/payment_delay");
const { get_random_int, MS_FOR_ONE_YEAR } = require('./utilities_controller');
const { Credit_Card_Type } = require("../models/credit_card_type");
const { send_card_aprovement_email } = require('./email_controller');

const card_statement = (req, res) => {
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session => {
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente.'});
        }else{
            Card.findOne({where: {id_card: req.body.id_card}, raw: true}).then(card =>{
                if(card.card_type == 1){
                    credit_card_statement(req, res, session);
                }else if(card.card_type == 2){
                    debit_card_statement(req, res, session);
                }else{
                    res.status(403).json({information_message: 'No existe el tipo de tarjeta solicitado.'});
                }
            });
        }
    });
};

const credit_card_statement = (req, res, session) => {
    Credit_Card.findOne({where : {id_card: req.body.id_card}, raw: true}).then(credit_card => {
        Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user =>{
            if((credit_card.cui == bank_user.cui) || (bank_user.user_type > 2)){
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
            }else{
                res.status(403).json({information_message: 'No tiene acceso a esta información, la cuenta no le pertenece.'});
            }
        });
    });
};

const debit_card_statement = (req, res, session) => {
    Debit_Card.findOne({where: {id_card: req.body.id_card}, raw: true}).then(debit_card =>{
        Account.findOne({where: {id_account: debit_card.id_account}, raw: true}).then(account => {
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user => {
                if((account.cui == bank_user.cui) || (bank_user.user_type > 2)){
                    Card_Payment_Log.findAll({where: {id_card: debit_card.id_card}, raw: true}).then(payments =>{
                        res.status(200).json({
                            id_card: debit_card.id_card,
                            cui: account.cui,
                            id_account: debit_card.id_account,
                            payments: payments
                        });
                    });
                }else{
                    res.status(403).json({information_message: 'No tiene acceso a esta información, la cuenta no le pertenece.'});
                }
            });
        });
    });
};

const credit_card_verfication = ()=>{
    const actual_date = new Date(Date.now());
    Credit_Card.findAll({where: {cutoff_date: actual_date}}).then(credit_cards=>{
        credit_cards.forEach(credit_card => {
            actual_date.setMonth((actual_date.getMonth()==11)? 0 : actual_date.getMonth()+1);
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
                        Card.create({
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

module.exports = {
    card_statement,
    credit_card_verfication,
    card_cancellation,
    create_card
}