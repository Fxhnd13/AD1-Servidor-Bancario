
const loan_statement = (req, res) => {
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session => {
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente.'});
        }else{
            Loan.findOne({where : {id_loan: req.body.id_loan}, raw: true}).then(loan => {
                Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user =>{
                    if((loan.owner_cui == bank_user.cui) || (bank_user.bank_user_type > 2)){
                        Payment_Log.findAll({where: {id_loan: loan.id_loan}, raw: true}).then(payments =>{
                            res.status(200).json({
                                id_loan: loan.id_loan,
                                owner_cui: loan.owner_cui,
                                guarantor_cui: loan.guarantor_cui,
                                amount: loan.amount,
                                interest_rate: loan.interest_rate,
                                payment_date: loan.payment_date,
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

module.exports = {
    loan_statement
}