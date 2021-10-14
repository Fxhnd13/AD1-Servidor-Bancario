const { Bank_User } = require("../models/bank_user");
const { Active_Session_Log } = require('../models/active_session_log');
const { Credit_Card } = require('../models/credit_card');
const { Debit_Card } = require('../models/debit_card');
const { Account } = require('../models/account');
const { Card_Payment_Log } = require('../models/card_payment_log');

const card_statement = (req, res) => {
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session => {
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente.'});
        }else{
            if(req.body.card_type == 'credit'){
                credit_card_statement(req, res, session);
            }else if(req.body.card_type == 'debit'){
                debit_card_statement(req, res, session);
            }else{
                res.status(403).json({information_message: 'No existe el tipo de tarjeta solicitado.'});
            }
        }
    });
};

const credit_card_statement = (req, res, session) => {
    Credit_Card.findOne({where : {id_card: req.body.id_card}, raw: true}).then(credit_card => {
        Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user =>{
            if((credit_card.owner_cui == bank_user.cui) || (bank_user.bank_user_type > 2)){
                Card_Payment_Log.findAll({where: {id_card: credit_card.id_card}, raw: true}).then(payments =>{
                    res.status(200).json({
                        id_card: credit_card.id_card,
                        owner_cui: credit_card.owner_cui,
                        credit_card_type: credit_card.credit_card_type,
                        credit_limit: credit_card.credit_limit,
                        interest_rate: credit_card.interest_rate,
                        cutoff_date: credit_card.cutoff_date,
                        balance: credit_card.balance,
                        payments: payments
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
                if((account.cui == bank_user.cui) || (bank_user.bank_user_type > 2)){
                    Card_Payment_Log.findAll({where: {id_card: credit_card.id_card}, raw: true}).then(payments =>{
                        res.status(200).json({
                            id_card: debit_card.id_card,
                            owner_cui: account.cui,
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

module.exports = {
    card_statement
}