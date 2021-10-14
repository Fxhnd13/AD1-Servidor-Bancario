const { Active_Session_Log } = require("../models/active_session_log");
const { Bank_User } = require("../models/bank_user");
const { Op } = require('sequelize');
const { Account } = require("../models/account");
const { send_deposit_email } = require("./email_controller");

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
                                if(origin_account.balance < req.body.amount){
                                    origin_account.update({balance: origin_account.balance-req.body.amount});
                                    destination_account.update({balance: destination_account.balance+req.body.amount});
                                    Transfer.create({amount: req.body.amount,origin_account: req.body.origin_account,destination_account: req.body.destination_account,date_time: sequelize.fn('NOW')}).then(transfer => {
                                        send_transfer_email(transfer);
                                    });
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

const account_statement = (req, res) => {
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session => {
        if(session == null){
            //error de expiracion
        }else{
            //verificar primero que sea el dueño
            Account.findOne({where : {id_account: req.body.id_account}, raw: true}).then(account => {
                var movements = [];
                Deposit.findAll({where: {destination_account: req.body.id_account}, raw: true}).then(deposits => {
                    deposits.forEach(deposit => {
                        movements.push({movement_type: 'Deposito', amount: deposit.amount, date_time: deposit.date_time});
                    });
                });
                Withdrawal.findAll({where: {origin_account: req.body.id_account}, raw: true}).then(withdrawals => {
                    withdrawals.forEach(withdrawal => {
                        movements.push({movement_type: 'Retiro', amount: withdrawal.amount, date_time: withdrawal.date_time});
                    });
                });
                res.status(200).json({
                    id_account: account.id_account,
                    id_account_type: account.id_account_type,
                    balance: account.balance,
                    movements: movements
                })
            });
        }
    });
};

module.exports = {
    transfer_on_app,
    account_statement
}