const { Person } = require('./person');
const { Bank_User } = require('./bank_user');
const { Bank_User_Type } = require('./bank_user_type');
const { Account } = require('./account');
const { Account_Type } = require('./account_type');
const { Active_Session_Log } = require('./active_session_log');
const { Bank_User_Status_Log } = require('./bank_user_status_log');
const { Email } = require('./email');
const { Request } = require('./request');
const { Credit_Card_Request } = require('./credit_card_request');
const { Debit_Card_Request } = require('./debit_card_request');
const { Loan_Request } = require('./loan_request');
const { Update_Data_Request } = require('./update_data_request');
const { Card_Cancellation_Request } = require('./card_cancellation_request');
const { Account_Request } = require('./account_request');

const syncronization = async (req, res) => {
    await Person.sync({force: true});
    await Bank_User_Type.sync({force: true});
    await Account_Type.sync({force: true});
    await Bank_User.sync({force: true});
    await Active_Session_Log.sync({force: true});
    await Account.sync({force: true});
    await Bank_User_Status_Log.sync({force: true});
    await Email.sync({force: true});
    await Request.sync({force: true});
    await Credit_Card_Request.sync({force: true});
    await Debit_Card_Request.sync({force: true});
    await Loan_Request.sync({force: true});
    await Update_Data_Request.sync({force: true});
    await Card_Cancellation_Request.sync({force: true});
    await Account_Request.sync({force: true});
    res.send('Base de datos sincronizada');
};

module.exports = {
    syncronization
}