const { Active_Session_Log } = require('../models/active_session_log');
const { Account } = require('../models/account');
const { Credit_Card } = require('../models/credit_card');
const { Loan } = require('../models/loan');
const { Bank_User } = require('../models/bank_user');
const { Debit_Card } = require('../models/debit_card');
const { Card } = require('../models/card');

const active_services = (req, res) =>{
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session => {
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente.'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user =>{
                var services = [];
                var accounts_promise = Account.findAll({where: {cui: bank_user.cui}, raw: true});
                var cards_promise = Card.findAll({where: {cui: bank_user.cui, active: true}, raw: true});
                var loan_promise = Loan.findAll({where: {cui: bank_user.cui}, raw: true});
                Promise.all([accounts_promise,cards_promise,loan_promise]).then(values =>{
                    accounts = values[0];
                    cards = values[1];
                    loans = values[2];
                    accounts.forEach(account =>{
                        services.push({id: account.id_account, type: 'Cuenta bancaria', balance: account.balance});
                    });
                    cards.forEach(card =>{
                        services.push({id: card.id_card, type: ((card.card_type == 1)? 'Tarjeta de credito':'Tarjeta de debito'), balance: '----------'});
                    });
                    loans.forEach(loan =>{
                        services.push({id: loan.id_loan, type: 'Prestamo bancario', balance: loan.amount});
                    });
                });
            });
        }
    });
};

module.exports = {
    active_services
}