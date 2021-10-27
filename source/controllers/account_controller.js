const { Active_Session_Log } = require("../models/active_session_log");
const { Bank_User } = require("../models/bank_user");
const { Op } = require('sequelize');
const { Account } = require("../models/account");
const { send_deposit_email, send_withdrawal_email } = require("./email_controller");
const { Card_Payment_Log } = require("../models/card_payment_log");
const { Withdrawal } = require("../models/withdrawal");
const { Deposit } = require('../models/deposit');
const { Debit_Card } = require('../models/debit_card');
const jwt = require('jsonwebtoken'); //Indicamos que usaremos JsonWebToken
const { Account_Type } = require("../models/account_type");
const { has_client_access, is_owner, has_bureaucratic_or_admin_access, has_cashier_access, has_admin_access } = require("./utilities_controller");

const transfer_on_app = (req, res) => {
    Active_Session_Log.findOne({ where: {token: req.headers.token}, raw: true}).then(session => {
        if(session == null){
            res.status(401).json({information_message: 'El token de sesion ha expirado, inicie sesion nuevamente'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user => {
                Account.findAndCountAll({where:{[Op.or]: [{id_account: req.body.id_origin_account},{id_account: req.body.id_destination_account}]}}).then(accounts => {
                    if(accounts.count == 2){
                        var origin_account = (accounts.rows[0].id_account == req.body.id_origin_account)? accounts.rows[0] : accounts.rows[1];
                        var destination_account = (accounts.rows[0].id_account == req.body.id_destination_account)? accounts.rows[0] : accounts.rows[1];
                        if(is_owner(bank_user.cui, origin_account) || has_cashier_access(bank_user.user_type)){
                            if(parseFloat(origin_account.balance) >= parseFloat(req.body.amount)){
                                origin_account.update({balance: parseFloat(origin_account.balance)-parseFloat(req.body.amount)});
                                destination_account.update({balance: parseFloat(destination_account.balance)+parseFloat(req.body.amount)});
                                Withdrawal.create({amount: req.body.amount, origin_account: req.body.id_origin_account, responsible_username: bank_user.username, date_time: new Date(Date.now())}).then(withdrawal => {
                                    send_withdrawal_email(withdrawal);
                                });
                                Deposit.create({amount: req.body.amount, destination_account: req.body.id_destination_account, responsible_username: bank_user.username, date_time: new Date(Date.now())}).then(deposit =>{
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
                        res.status(403).json({information_message: 'La cuenta destino ingresada, no existe.'});
                    }
                });
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
    movements.sort(function(o1,o2){return (o1.date_time < o2.date_time)? -1 : (o1.date_time > o2.date_time)? 1 : 0;});
    res.status(200).json({
        id_account: account.id_account,
        id_account_type: account.id_account_type,
        account_type_description: ((account.id_account_type==1)? 'Cuenta de ahorro': 'Cuenta monetaria'),
        balance: account.balance,
        movements: movements
    });
}

const account_statement = async (req, res) => {
    await Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session => {
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente.'});
        }else{
            Account.findOne({where : {id_account: req.query.id_account}, raw: true}).then(account => {
                Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user =>{
                    console.log(bank_user.cui);
                    console.log(account.cui);
                    if(is_owner(bank_user.cui, account.cui) || has_bureaucratic_or_admin_access(bank_user.user_type)){
                        var deposit_promise = Deposit.findAll({where: {destination_account: req.query.id_account}, raw: true});
                        var withdrawal_promise = Withdrawal.findAll({where: {origin_account: req.query.id_account}, raw: true});
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

const account_available_for_debit_card = (req, res) =>{
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session =>{
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user=>{
                Account.findAll({where: {cui: bank_user.cui}, raw: true}).then(accounts=>{
                    var accounts_available_promises = [];
                    accounts.forEach(account=>{
                        accounts_available_promises.push(Debit_Card.findOne({where: {id_account: account.id_account}, raw: true}));
                    });
                    Promise.all(accounts_available_promises).then(available_accounts =>{
                        var result = []; var contador=0;
                        available_accounts.forEach(available_account =>{
                            if(available_account == null) result.push({id_account: accounts[contador++].id_account});
                        });
                        res.status(200).json({accounts: result});
                    });
                });
            });
        }
    });
}; 

const create_account = (req, res)=>{
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session => {
        if(session == null) {
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user => {
                if(has_bureaucratic_or_admin_access(bank_user.user_type)){
                    if(req.body.id_request != undefined){
                        Request.findOne({where: {id_request: req.body.id_request}}).then(request=>{
                            request.update({verified: true});
                        });
                    }
                    Account.create({
                        cui: req.body.cui,
                        id_account_type: req.body.id_account_type,
                        balance: req.body.balance
                    }).then(()=>{
                        res.status(200).json({information_message: 'La cuenta se ha creado exitosamente'});
                    });
                }else{
                    res.status(403).json({information_message: 'No posee permisos para realizar esta acción.'});
                }
            });
        }
    });
};

const get_all_accounts = (req, res) => {
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session => {
        if(session == null) {
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user => {
                if(has_bureaucratic_or_admin_access(bank_user.user_type)){
                    Account.findAll().then(accounts=>{
                        res.status(200).json({accounts: accounts});
                    });
                }else{
                    res.status(403).json({information_message: 'No posee permisos para realizar esta acción.'});
                }
            });
        }
    });
};

const get_account_by_id = (req, res) => {
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session => {
        if(session == null) {
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user => {
                if(has_bureaucratic_or_admin_access(bank_user.user_type)){
                    Account.findOne({where: {id_account: req.query.id_account}}).then(account=>{
                        res.status(200).json(account);
                    });
                }else{
                    res.status(403).json({information_message: 'No posee permisos para realizar esta acción.'});
                }
            });
        }
    });    
};

const update_account = (req, res) => {
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session => {
        if(session == null) {
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user => {
                if(has_bureaucratic_or_admin_access(bank_user.user_type)){
                    res.status(500).json({information_message: 'Sin implementar aún.'});
                }else{
                    res.status(403).json({information_message: 'No posee permisos para realizar esta acción.'});
                }
            });
        }
    });  
};

const do_deposit = (req, res) => {
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session => {
        if(session == null) {
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user => {
                if(has_cashier_access(bank_user.user_type)){
                    Account.findOne({where: {id_account: req.body.destination_account}}).then(account=>{
                        if(account != null){
                            Deposit.create({
                                amount: req.body.amount,
                                destination_account: req.body.destination_account,
                                responsible_username: bank_user.username,
                                date_time: new Date(Date.now())
                            }).then(deposit=>{
                                account.update({balance: (parseFloat(account.balance)+parseFloat(req.body.amount))}).then(()=>{
                                    send_deposit_email(deposit);
                                    res.status(200).json({information_message: 'Se ha realizado el deposito correctamente.'});
                                });
                            })
                        }else{
                            res.status(403).json({information_message: 'La cuenta a la que desea depositar no existe.'});
                        }
                    });
                }else{
                    res.status(403).json({information_message: 'No posee permisos para realizar esta acción.'});
                }
            });
        }
    });  
};

const do_withdrawal = (req, res) => {
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session => {
        if(session == null) {
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user => {
                if(has_cashier_access(bank_user.user_type)){
                    console.log(req.body);
                    Account.findOne({where: {id_account: req.body.origin_account}}).then(account=>{
                        if(account != null){
                            if(parseFloat(account.balance) >= parseFloat(req.body.amount)){
                                Withdrawal.create({
                                    amount: req.body.amount,
                                    origin_account: req.body.origin_account,
                                    responsible_username: bank_user.username,
                                    date_time: new Date(Date.now())
                                }).then(withdrawal=>{
                                    account.update({balance: (parseFloat(account.balance)+parseFloat(req.body.amount))}).then(()=>{
                                        send_withdrawal_email(withdrawal);
                                        res.status(200).json({information_message: 'Se ha realizado el retiro correctamente.'});
                                    });
                                });
                            }else{
                                res.status(403).json({information_message: 'La cuenta no posee los fondos necesarios para realizar esta acción.'});
                            }
                        }else{
                            res.status(403).json({information_message: 'La cuenta de la que desea retirar no existe.'});
                        }
                    });
                }else{
                    res.status(403).json({information_message: 'No posee permisos para realizar esta acción.'});
                }
            });
        }
    });  
};

const get_all_transactions_by_an_user = (req, res) =>{
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session=>{
        if(session==null){
            res.status(401).json({information_message: 'Token de sesion ah expirado, inicie sesion nuevamente.'});
        }else{
            const bank_user = jwt.decode(req.headers.token);
            if(has_admin_access(bank_user.user_type)){
                var deposit_promise = Deposit.findAll({where:{responsible_username: req.query.username},raw: true});
                var withdrawal_promise = Withdrawal.findAll({where:{responsible_username: req.query.username},raw: true});
                Promise.all([deposit_promise, withdrawal_promise]).then(values=>{
                    const transactions = values[0].concat(values[1]);
                    var result = []; contador = 1;
                    transactions.forEach(transaction=>{
                        if(transaction.destination_account != undefined){
                            result.push({
                                no: contador++,
                                amount: transaction.amount, 
                                responsible_username: transaction.responsible_username,
                                id_account: transaction.destination_account,
                                movement_type: 'Deposito',
                                date_time: transaction.date_time
                            });
                        }else{
                            result.push({
                                no: contador++,
                                amount: transaction.amount, 
                                responsible_username: transaction.responsible_username,
                                id_account: transaction.origin_account,
                                movement_type: 'Retiro',
                                date_time: transaction.date_time
                            });
                        }
                    });
                    result.sort(function(o1,o2){return (o1.date_time < o2.date_time)? -1 : (o1.date_time > o2.date_time)? 1 : 0;});
                    res.status(200).json(result);
                });
            }else{
                res.status(403).json({information_message: 'No posee permiso para realizar esta acción'});
            }
        }
    });
};

const get_all_transactions = (req, res) => {
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session=>{
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user=>{
                Account.findAll({where: {cui: bank_user.cui}, raw: true}).then(accounts=>{
                    var deposit_promises =[];
                    var withdrawal_promises = [];
                    accounts.forEach(account=>{
                        deposit_promises.push(Deposit.findAll({where:{destination_account: account.id_account}, raw: true}));
                        withdrawal_promises.push(Withdrawal.findAll({where:{origin_account: account.id_account}, raw: true}));
                    });
                    Promise.all(deposit_promises.concat(withdrawal_promises)).then(transactions_array=>{
                        var result = [], contador = 1;
                        transactions_array.forEach(transactions=>{
                            transactions.forEach(transaction=>{
                                if(transaction.destination_account != undefined){
                                    result.push({
                                        no: contador++,
                                        amount: transaction.amount, 
                                        responsible_username: transaction.responsible_username,
                                        id_account: transaction.destination_account,
                                        movement_type: 'Deposito',
                                        date_time: transaction.date_time
                                    });
                                }else{
                                    result.push({
                                        no: contador++,
                                        amount: transaction.amount, 
                                        responsible_username: transaction.responsible_username,
                                        id_account: transaction.origin_account,
                                        movement_type: 'Retiro',
                                        date_time: transaction.date_time
                                    });
                                }
                            });
                        });
                        result.sort(function(o1,o2){return (o1.date_time < o2.date_time)? -1 : (o1.date_time > o2.date_time)? 1 : 0;});
                        res.status(200).json(result);
                    });
                });
            });
        }
    });
};

const account_verification = () =>{
    Account.findAll({where: {id_account_type: 1}, include: Account_Type}).then(accounts=>{
        accounts.forEach(account=>{
            account.update({
                balance: parseFloat(account.balance)+(parseFloat(account.balance)*parseFloat(account.account_type.interest_rate))
            });
        });
    });
};

module.exports = {
    transfer_on_app,
    account_statement,
    account_available_for_debit_card,
    create_account,
    update_account,
    get_account_by_id,
    get_all_accounts,
    do_deposit,
    do_withdrawal,
    get_all_transactions,
    get_all_transactions_by_an_user,
    account_verification
}