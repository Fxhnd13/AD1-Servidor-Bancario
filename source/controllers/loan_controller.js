const { Active_Session_Log } = require('../models/active_session_log');
const { Loan } = require('../models/loan');
const { Bank_User } = require('../models/bank_user');
const { Payment_Log } = require('../models/payment_log');
const { Op } = require('sequelize');
const { sequelize } = require('../db/credentials');

const loan_statement = (req, res) => {
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session => {
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente.'});
        }else{
            Loan.findOne({where : {id_loan: req.body.id_loan}, raw: true}).then(loan => {
                Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user =>{
                    if((loan.cui == bank_user.cui) || (bank_user.user_type > 2)){
                        Payment_Log.findAll({where: {id_loan: loan.id_loan}, raw: true}).then(payments =>{
                            res.status(200).json({
                                id_loan: loan.id_loan,
                                cui: loan.cui,
                                guarantor_cui: loan.guarantor_cui,
                                amount: loan.amount,
                                balance: loan.balance,
                                monthly_payment: loan.monthly_payment,
                                interest_rate: loan.interest_rate,
                                cutoff_date: loan.cutoff_date,
                                payments: payments
                            });
                        });
                    }else{
                        res.status(403).json({information_message: 'No tiene acceso a esta información, la cuenta no le pertenece.'});
                    }
                });
            });
        }
    });
};

const loan_verification = ()=>{
    const actual_date = new Date(Date.now());
    Loan.findAll({where: {cutoff_date: actual_date}}).then(loans=>{
        loans.forEach(loan => {
            actual_date.setMonth((actual_date.getMonth()==11)? 0 : actual_date.getMonth()+1);
            loan.cutoff_date = actual_date;
            loan.balance = parseFloat(loan.balance) + (parseFloat(loan.monthly_payment)*parseFloat(loan.interest_rate));
            loan.save();
            Payment_Log.findOne({order: [['id_payment', 'DESC']]}).then(last_payment=>{
                if(last_payment == null){
                    Payment_Log.create({id_loan: loan.id_loan, date: new Date(Date.now()), amount: 0, balance: parseFloat(loan.balance), total_payment: 0});
                }else{
                    Payment_Log.create({id_loan: loan.id_loan, date: new Date(Date.now()), amount: 0, balance: parseFloat(loan.balance), total_payment: last_payment.total_payment});
                }
            });
        });
    });
};

module.exports = {
    loan_statement,
    loan_verification
}