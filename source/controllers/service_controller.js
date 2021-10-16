const { Active_Session_Log } = require('../models/active_session_log');
const { Account } = require('../models/account');
const { Credit_Card } = require('../models/credit_card');
const { Loan } = require('../models/loan');
const { Bank_User } = require('../models/bank_user');
const { Debit_Card } = require('../models/debit_card');

const active_services = (req, res) =>{
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session => {
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente.'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user =>{
                var services = [];
                var accounts_promise = Account.findAll({where: {cui: bank_user.cui}, raw: true});
                var credit_cards_promise = Credit_Card.findAll({where: {cui: bank_user.cui}, raw: true});
                var loan_promise = Loan.findAll({where: {cui: bank_user.cui}, raw: true});
                Promise.all([accounts_promise,credit_cards_promise,loan_promise]).then(values =>{
                    accounts = values[0];
                    credit_cards = values[1];
                    loans = values[2];
                    var debit_card_promises = [];
                    accounts.forEach(account =>{
                        services.push({id: account.id_account, type: 'Cuenta bancaria', balance: account.balance});
                        debit_card_promises.push(Debit_Card.findAll({where: {id_account: account.id_account}, raw: true}));
                    });
                    credit_cards.forEach(credit_card =>{
                        services.push({id: credit_card.id_card, type: 'Tarjeta de credito', balance: credit_card.balance});
                    });
                    loans.forEach(loan =>{
                        services.push({id: loan.id_loan, type: 'Prestamo bancario', balance: loan.amount});
                    });
                    Promise.all(debit_card_promises).then(debit_card_accounts=>{
                        var contador=0;
                        debit_card_accounts.forEach(debit_cards =>{
                            debit_cards.forEach(debit_card=>{
                                services.push({id: debit_card.id_card, type: 'Tarjeta de debito', balance: accounts[contador].balance});
                            });
                            contador++;
                        });
                        res.status(200).json({services: services});
                    });
                });
            });
        }
    });
};

module.exports = {
    active_services
}