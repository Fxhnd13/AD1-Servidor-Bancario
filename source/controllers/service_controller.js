const { Active_Session_Log } = require('../models/active_session_log');
const { Account } = require('../models/account');
const { Credit_Card } = require('../models/credit_card');
const { Loan } = require('../models/loan');
const { Bank_User } = require('../models/bank_user');
const { Debit_Card } = require('../models/debit_card');
const { Card } = require('../models/card');
const { Account_Type } = require('../models/account_type');

const active_services = (req, res) =>{
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session => {
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente.'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user =>{
                var services = [];
                var accounts_promise = Account.findAll({where: {cui: bank_user.cui}, raw: true, include: Account_Type});
                var credit_cards_promise = Card.findAll({
                    where: {cui: bank_user.cui, active: true, card_type: 1}, 
                    raw: true,
                    include: Credit_Card
                });
                var debit_cards_promise = Card.findAll({
                    where: {cui: bank_user.cui, active: true, card_type: 2}, 
                    raw: true,
                    include: {
                        model: Debit_Card,
                        as: 'debit_card',
                        include: {
                            model: Account,
                            as: 'account'
                        }
                    }
                });
                var loan_promise = Loan.findAll({where: {cui: bank_user.cui}, raw: true});
                Promise.all([accounts_promise,credit_cards_promise,debit_cards_promise,loan_promise]).then(values =>{
                    accounts = values[0];
                    credit_cards = values[1];
                    debit_cards = values[2];
                    loans = values[3];
                    accounts.forEach(account =>{
                        services.push({id: account.id_account, type: account["account_type.description"], balance: account.balance});
                    });
                    credit_cards.forEach(card =>{
                        services.push({id: card.id_card, type: 'Tarjeta de credito', balance: card["credit_card.balance"]});
                    });
                    debit_cards.forEach(card =>{
                        services.push({id: card.id_card, type: 'Tarjeta de debito', balance: card["debit_card.account.balance"]});
                    });
                    loans.forEach(loan =>{
                        services.push({id: loan.id_loan, type: 'Prestamo bancario', balance: loan.amount});
                    });
                    res.writeHead(200, {'token': req.headers.token, 'services': services});
                    res.status(200).json(services);
                });
            });
        }
    });
};

module.exports = {
    active_services
}