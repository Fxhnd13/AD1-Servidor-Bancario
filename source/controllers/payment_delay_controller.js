const { Payment_Delay } = require("../models/payment_delay");

const payment_delay_verification = ()=>{
    Payment_Delay.findAll({where: {canceled: false}}).then(payments => {
        payments.forEach(payment =>{
            payment.total_debt = parseFloat(payment.total_debt) + (parseFloat(payment.total_debt)*parseFloat(payment.interest_rate));
            payment.save();
        })
    });
};

module.exports = {
    payment_delay_verification
}