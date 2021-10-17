const { Active_Session_Log } = require('../models/active_session_log');
const { Loan } = require('../models/loan');
const { Bank_User } = require('../models/bank_user');
const { Payment_Log } = require('../models/payment_log');

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

const create_loan = (req, res)=>{
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session =>{
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user=>{
                if(bank_user.user_type > 2){
                    Loan.create({
                        cui: req.body.cui,
                        guarantor_cui: req.body.guarantor_cui,
                        amount: req.body.amount,
                        balance: (parseFloat(req.body.amount)+(parseFloat(req.body.interest_rate)*parseFloat(req.body.amount))),
                        monthly_payment: req.body.monthly_payment,
                        interest_rate: req.body.interest_rate,
                        cutoff_date: req.body.cutoff_date,
                        State: 'activo'
                    }).then(()=>{
                        res.status(200).json({information_message: 'Se ha registrado el prestamo bancario con éxito.'});
                    });
                }else{
                    res.status(403).json({information_message: 'No posee permisos para realizar esta acción'});
                }
            });
        }
    });
};

const get_all_loans = (req, res) =>{
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session =>{
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user=>{
                if(bank_user.user_type > 2){
                    Loan.findAll().then(loans=>{
                        res.status(200).json({loans: loans});
                    });
                }else{
                    res.status(403).json({information_message: 'No posee permisos para realizar esta acción'});
                }
            })
        }
    });
};

const get_loan_by_id = (req, res) =>{
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session =>{
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user=>{
                if(bank_user.user_type > 2){
                    Loan.findOne({where: {id_loan: req.body.id_loan}}).then(loan=>{
                        res.status(200).json(loan);
                    });
                }else{
                    res.status(403).json({information_message: 'No posee permisos para realizar esta acción'});
                }
            })
        }
    });
};

const update_loan = (req, res)=>{
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session =>{
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente'});
        }else{
            res.status(500).json({information_message: 'Sin implementar'});
        }
    });
};

module.exports = {
    loan_statement,
    loan_verification,
    create_loan,
    update_loan,
    get_all_loans,
    get_loan_by_id
}