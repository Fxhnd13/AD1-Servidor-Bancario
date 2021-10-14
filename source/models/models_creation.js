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
const { Credit_Card_Type } = require('./credit_card_type');
const { Deposit } = require('./deposit');
const { Withdrawal } = require('./withdrawal');
const { Transfer } = require('./transfer');
const { Payment_Delay } = require('./payment_delay');
const { Payment_Log } = require('./payment_log');
const { Card_Payment_Log } = require('./card_payment_log');
const { Loan } = require('./loan');
const { Credit_Card } = require('./credit_card');
const { Debit_Card } = require('./debit_card');
const { Card } = require('./card');

const bcrypt = require("bcrypt");
var BCRYPT_SALT_ROUNDS = 3;

const syncronization = async (req, res) => {
    await Bank_User_Type.sync({force: true});
    await Account_Type.sync({force: true});
    await Credit_Card_Type.sync({force: true});
    await Person.sync({force: true});
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
    await Card.sync({force: true});
    await Credit_Card.sync({force: true});
    await Debit_Card.sync({force: true});
    await Loan.sync({force: true});
    await Card_Payment_Log.sync({force: true});
    await Deposit.sync({force: true});
    await Payment_Delay.sync({force: true});
    await Payment_Log.sync({force: true});
    await Transfer.sync({force: true});
    await Withdrawal.sync({force: true});
    //----------------------------AGREGANDO DATA INICIAL------------------------------
    await Bank_User_Type.bulkCreate([
        {description: "Cliente"},
        {description: "Cajero"},
        {description: "Burocratico"},
        {description: "Administrador"}
    ]);
    await Account_Type.bulkCreate([
        {description: "Cuenta de ahorro",interest_rate: 0.15},
        {description: "Cuenta monetaria",interest_rate: 0}
    ]);
    await Person.bulkCreate([
        {cui: 1000000000001, name: "Jose", surname: "Soberanis", address: "direccion", phone_number: 11111111, birth_day: "1999-09-20", gender: "M", ocupation: "Estudiante"},
        {cui: 1000000000002, name: "Carlos", surname: "Ramirez", address: "direccion", phone_number: 11111111, birth_day: "1999-09-20", gender: "M", ocupation: "Estudiante"},
        {cui: 1000000000003, name: "Sofia", surname: "Quintana", address: "direccion", phone_number: 11111111, birth_day: "1998-04-20", gender: "F", ocupation: "Estudiante"},
        {cui: 1000000000004, name: "Alejandra", surname: "Gutierrez", address: "direccion", phone_number: 11111111, birth_day: "1998-04-20", gender: "F", ocupation: "Estudiante"},
        {cui: 1000000000005, name: "Helmut", surname: "Luther", address: "direccion", phone_number: 11111111, birth_day: "1998-08-20", gender: "M", ocupation: "Estudiante"},
        {cui: 1000000000006, name: "Alexander", surname: "Montejo", address: "direccion", phone_number: 11111111, birth_day: "1998-08-20", gender: "M", ocupation: "Estudiante"}
    ]);
    await Account.bulkCreate([
        {cui: 1000000000004, id_account_type: 1, balance: 0},
        {cui: 1000000000005, id_account_type: 1, balance: 250},
        {cui: 1000000000006, id_account_type: 1, balance: 1000}
    ])
    bcrypt.hash("pass",BCRYPT_SALT_ROUNDS).then(async hashed_password => {
        await Bank_User.bulkCreate([
            {username: 'user1', password: hashed_password, user_type: 4, cui: 1000000000001},
            {username: 'user2', password: hashed_password, user_type: 3, cui: 1000000000002},
            {username: 'user3', password: hashed_password, user_type: 2, cui: 1000000000003},
            {username: 'user4', password: hashed_password, user_type: 1, cui: 1000000000004}
        ]);
        await Email.bulkCreate([
            {username: 'user1', email: 'jcsru13@gmail.com'},
            {username: 'user2', email: 'jcsru13@gmail.com'},
            {username: 'user3', email: 'jcsru13@gmail.com'},
            {username: 'user4', email: 'jcsru13@gmail.com'}
        ]);
    });
    res.send('Base de datos sincronizada');
};

module.exports = {
    syncronization
}