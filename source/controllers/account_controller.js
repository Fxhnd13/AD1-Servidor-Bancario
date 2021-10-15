const { Active_Session_Log } = require("../models/active_session_log");
const { Bank_User } = require("../models/bank_user");
const { Op } = require('sequelize');
const { Account } = require("../models/account");
const { send_deposit_email, send_withdrawal_email } = require("./email_controller");
const { Card_Payment_Log } = require("../models/card_payment_log");
const { Withdrawal } = require("../models/withdrawal");
const { Deposit } = require('../models/deposit');
const { Debit_Card } = require('../models/debit_card');
const { sequelize } = require("../db/credentials");

const transfer_on_app = (req, res) => {
    Active_Session_Log.findOne({ where: {token: req.headers.token}, raw: true}).then(session => {
        if(session == null){
            res.status(401).json({information_message: 'El token de sesion ha expirado, inicie sesion nuevamente'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user => {
                if(bank_user.user_type == 1){
                    Account.findAndCountAll({where:{[Op.or]: [{id_account: req.body.origin_account},{id_account: req.body.destination_account}]}}).then(accounts => {
                        if(accounts.count == 2){
                            var origin_account = (accounts.rows[0].id_account == req.body.origin_account)? accounts.rows[0] : accounts.rows[1];
                            var destination_account = (accounts.rows[0].id_account == req.body.destination_account)? accounts.rows[0] : accounts.rows[1];
                            if(origin_account.cui == bank_user.cui){
                                if(parseFloat(origin_account.balance) >= parseFloat(req.body.amount)){
                                    origin_account.update({balance: parseFloat(origin_account.balance)-parseFloat(req.body.amount)});
                                    destination_account.update({balance: parseFloat(destination_account.balance)+parseFloat(req.body.amount)});
                                    Withdrawal.create({amount: req.body.amount, origin_account: req.body.origin_account, responsible_username: bank_user.username, date_time: sequelize.fn('NOW')}).then(withdrawal => {
                                        send_withdrawal_email(withdrawal);
                                    });
                                    Deposit.create({amount: req.body.amount, destination_account: req.body.destination_account, responsible_username: bank_user.username, date_time: sequelize.fn('NOW')}).then(deposit =>{
                                        send_deposit_email(deposit);
                                    });
                                    res.status(200).json({information_message: 'Se ha realizado la transferencia con exito'});
                                }else{
                                    res.status(400).json({information_message: 'La cuenta origen no posee los fondos necesarios para realizar la transferencia.'})
                                }
                            }else{
                                res.status(400).json({information_message: 'No eres el dueño de al cuenta origen seleccionada.'});
                            }
                        }else{
                            res.status(400).json({information_message: 'La cuenta destino ingresada, no existe.'});
                        }
                    });
                }else{
                    res.status(400).json({information_message: 'Un usuario diferente a tipo cliente no puede realizar esta acción.'});
                }
            });
        }
    });
};

function do_account_satement(account, deposits, withdrawals, payments, res){
    var movements = [];
    if(deposits != null){
        deposits.forEach(deposit => {
            movements.push({movement_type: 'Deposito', amount: deposit.amount, date_time: deposit.date_time});
        });
    }
    if(withdrawals != null){
        withdrawals.forEach(withdrawal => {
                movements.push({movement_type: 'Retiro', amount: withdrawal.amount, date_time: withdrawal.date_time});
        });
    }
    if(payments != null){
        payments.forEach(payment => {
            movements.push({movement_type: 'Retiro con tarjeta', amount: payment.amount, date_time: payment.date_time});
        });
    }
    res.status(200).json({
        id_account: account.id_account,
        id_account_type: account.id_account_type,
        balance: account.balance,
        movements: movements
    });
}

const account_statement = async (req, res) => {
    await Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session => {
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente.'});
        }else{
            Account.findOne({where : {id_account: req.body.id_account}, raw: true}).then(account => {
                Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user =>{
                    if((account.cui == bank_user.cui) || (bank_user.user_type > 2)){
                        var deposit_promise = Deposit.findAll({where: {destination_account: req.body.id_account}, raw: true});
                        var withdrawal_promise = Withdrawal.findAll({where: {origin_account: req.body.id_account}, raw: true});
                        var debit_card_promise = Debit_Card.findOne({where: {id_account: account.id_account}, raw: true});
                        Promise.all([deposit_promise, withdrawal_promise, debit_card_promise]).then((values)=>{
                            deposits = values[0];
                            withdrawals = values[1];
                            debit_card = values[2];
                            if(debit_card != null){
                                Card_Payment_Log.findAll({where: {id_card: debit_card.id_card}, raw: true}).then(payments =>{
                                    do_account_satement(account, deposits, withdrawals, payments, res);
                                });
                            }else{
                                do_account_satement(account, deposits, withdrawals, null, res);
                            }
                        });
                    }else{
                        res.status(403).json({information_message: 'No tiene acceso a esta información, la cuenta no le pertenece.'});
                    }
                });
            });
        }
    });
};

module.exports = {
    transfer_on_app,
    account_statement
}