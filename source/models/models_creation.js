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
const { Credit_Card_Payment_Log } = require('./credit_card_payment_log');
const { CARD_OFFSET, plus_card_offset } = require('../controllers/utilities_controller');

const bcrypt = require("bcrypt");
const { sequelize } = require('../db/credentials');
const { Authorized_Institution } = require('./authorized_institution');
var BCRYPT_SALT_ROUNDS = 3;

const syncronization = async (req, res) => {
    //----------------------------------------------------------------------------
    await Bank_User_Type.sync({force: true});
    await Account_Type.sync({force: true});
    await Credit_Card_Type.sync({force: true});
    await Person.sync({force: true});
    await Bank_User.sync({force: true});
    await Active_Session_Log.sync({force: true});
    await Account.sync({force: true});
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
    await Withdrawal.sync({force: true});
    await Credit_Card_Payment_Log.sync({force: true});
    await Authorized_Institution.sync({force: true});
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
    await Credit_Card_Type.bulkCreate([
        {description: 'Platinum', credit_limit: 2000, interest_rate: 0.1},
        {description: 'Gold', credit_limit: 5000, interest_rate: 0.2},
        {description: 'Black', credit_limit: 12000, interest_rate: 0.3}
    ]);
    await Person.bulkCreate([
        {cui: 1000000000001, name: "nombre1", surname: "apellido1", address: "direccion", phone_number: 11111111, birth_day: "1999-09-20", gender: "M", ocupation: "Estudiante", last_update_date: new Date(Date.now())},
        {cui: 1000000000002, name: "nombre2", surname: "apellido2", address: "direccion", phone_number: 11111111, birth_day: "1999-09-20", gender: "M", ocupation: "Estudiante", last_update_date: new Date(Date.now())},
        {cui: 1000000000003, name: "nombre3", surname: "apellido3", address: "direccion", phone_number: 11111111, birth_day: "1998-04-20", gender: "F", ocupation: "Estudiante", last_update_date: new Date(Date.now())},
        {cui: 1000000000004, name: "nombre4", surname: "apellido4", address: "direccion", phone_number: 11111111, birth_day: "1998-04-20", gender: "F", ocupation: "Estudiante", last_update_date: new Date(Date.now())},
        {cui: 1000000000005, name: "nombre5", surname: "apellido5", address: "direccion", phone_number: 11111111, birth_day: "1998-08-20", gender: "M", ocupation: "Estudiante", last_update_date: new Date(Date.now())},
        {cui: 1000000000006, name: "nombre6", surname: "apellido6", address: "direccion", phone_number: 11111111, birth_day: "1998-08-20", gender: "M", ocupation: "Estudiante", last_update_date: new Date(Date.now())},
        {cui: 1000000000007, name: "nombre7", surname: "apellido7", address: "direccion", phone_number: 11111111, birth_day: "1998-08-20", gender: "M", ocupation: "Estudiante", last_update_date: new Date(Date.now())},
        {cui: 1000000000008, name: "nombre8", surname: "apellido8", address: "direccion", phone_number: 11111111, birth_day: "1998-08-20", gender: "M", ocupation: "Estudiante", last_update_date: new Date(Date.now())},
        {cui: 1000000000009, name: "nombre9", surname: "apellido9", address: "direccion", phone_number: 11111111, birth_day: "1998-08-20", gender: "M", ocupation: "Estudiante", last_update_date: new Date(Date.now())},
        {cui: 1000000000010, name: "nombre10", surname: "apellido10", address: "direccion", phone_number: 11111111, birth_day: "1998-08-20", gender: "M", ocupation: "Estudiante", last_update_date: new Date(Date.now())}
    ]);
    await Account.bulkCreate([
        {cui: 1000000000004, id_account_type: 1, balance: 0},
        {cui: 1000000000005, id_account_type: 1, balance: 250},
        {cui: 1000000000006, id_account_type: 1, balance: 1000},
        {cui: 1000000000007, id_account_type: 1, balance: 500},
        {cui: 1000000000007, id_account_type: 2, balance: 300},
        {cui: 1000000000007, id_account_type: 2, balance: 490},
        {cui: 1000000000008, id_account_type: 1, balance: 840},
        {cui: 1000000000008, id_account_type: 2, balance: 370},
        {cui: 1000000000009, id_account_type: 2, balance: 1640},
        {cui: 1000000000010, id_account_type: 2, balance: 1340}
    ]);
    await bcrypt.hash("pass",BCRYPT_SALT_ROUNDS).then(async hashed_password => {
        await Bank_User.bulkCreate([
            {username: 'user1', password: hashed_password, user_type: 4, cui: 1000000000001, access: true, last_update_date: new Date(Date.now())},
            {username: 'user2', password: hashed_password, user_type: 3, cui: 1000000000002, access: true, last_update_date: new Date(Date.now())},
            {username: 'user3', password: hashed_password, user_type: 2, cui: 1000000000003, access: true, last_update_date: new Date(Date.now())},
            {username: 'user4', password: hashed_password, user_type: 1, cui: 1000000000004, access: true, last_update_date: new Date(Date.now())},
            {username: 'user5', password: hashed_password, user_type: 1, cui: 1000000000005, access: true, last_update_date: new Date(Date.now())},
            {username: 'user6', password: hashed_password, user_type: 1, cui: 1000000000006, access: true, last_update_date: new Date(Date.now())},
            {username: 'user7', password: hashed_password, user_type: 1, cui: 1000000000007, access: true, last_update_date: new Date(Date.now())},
            {username: 'user8', password: hashed_password, user_type: 1, cui: 1000000000008, access: true, last_update_date: new Date(Date.now())}
        ]);
        await Email.bulkCreate([
            {username: 'user1', email: 'jcsru13@gmail.com'},
            {username: 'user2', email: 'jcsru13@gmail.com'},
            {username: 'user3', email: 'jcsru13@gmail.com'},
            {username: 'user4', email: 'sofiaquintana2@gmail.con'},
            {username: 'user5', email: 'sofiaquintana2@gmail.con'},
            {username: 'user6', email: 'alexanderluther08@gmail.com'},
            {username: 'user7', email: 'alexanderluther08@gmail.com'},
            {username: 'user8', email: 'alexanderluther08@gmail.com'}
        ]);
        await Authorized_Institution.bulkCreate([
            {name: 'Sarita Mazatenango', password: hashed_password},
            {name: 'Sarita Quetzaltenango', password: hashed_password},
            {name: 'Sarita Guatemala', password: hashed_password},
            {name: 'Sarita Antigua', password: hashed_password},
            {name: 'Sarita Peten', password: hashed_password},
        ])
    });
    await Card.bulkCreate([
        {id_card: plus_card_offset(0), pin: 1000, cui: 1000000000004, card_type: 1, expiration_date: '2025-12-12', active: true},
        {id_card: plus_card_offset(1), pin: 1000, cui: 1000000000005, card_type: 1, expiration_date: '2025-12-12', active: true},
        {id_card: plus_card_offset(2), pin: 1000, cui: 1000000000006, card_type: 1, expiration_date: '2025-12-12', active: true},
        {id_card: plus_card_offset(3), pin: 1000, cui: 1000000000006, card_type: 2, expiration_date: '2025-12-12', active: true},
        {id_card: plus_card_offset(4), pin: 1000, cui: 1000000000007, card_type: 2, expiration_date: '2025-12-12', active: true},
        {id_card: plus_card_offset(5), pin: 1000, cui: 1000000000008, card_type: 1, expiration_date: '2025-12-12', active: true},
        {id_card: plus_card_offset(6), pin: 1000, cui: 1000000000008, card_type: 2, expiration_date: '2025-12-12', active: true},
        {id_card: plus_card_offset(7), pin: 1000, cui: 1000000000008, card_type: 2, expiration_date: '2025-12-12', active: true},
        {id_card: plus_card_offset(8), pin: 1000, cui: 1000000000009, card_type: 2, expiration_date: '2025-12-12', active: true},
        {id_card: plus_card_offset(9), pin: 1000, cui: 1000000000010, card_type: 2, expiration_date: '2025-12-12', active: true}
    ]);
    await Credit_Card.bulkCreate([
        {id_card: plus_card_offset(0), id_credit_card_type: 1, credit_limit: 2000, interest_rate: 0.1, minimal_payment: 0.3, payment: 0, cutoff_date: '2021-11-02', balance: 0},
        {id_card: plus_card_offset(1), id_credit_card_type: 2, credit_limit: 5000, interest_rate: 0.2, minimal_payment: 0.3, payment: 0, cutoff_date: '2021-11-02', balance: 0},
        {id_card: plus_card_offset(2), id_credit_card_type: 3, credit_limit: 12000, interest_rate: 0.3, minimal_payment: 0.3, payment: 0, cutoff_date: '2021-11-02', balance: 0},
        {id_card: plus_card_offset(5), id_credit_card_type: 1, credit_limit: 2000, interest_rate: 0.1, minimal_payment: 0.3, payment: 0, cutoff_date: '2021-11-02', balance: 0}
    ]);
    await Debit_Card.bulkCreate([
        {id_card: plus_card_offset(3), id_account: 3},
        {id_card: plus_card_offset(4), id_account: 5},
        {id_card: plus_card_offset(6), id_account: 7},
        {id_card: plus_card_offset(7), id_account: 8},
        {id_card: plus_card_offset(8), id_account: 9},
        {id_card: plus_card_offset(9), id_account: 10}
    ]);
    await Deposit.bulkCreate([
        {amount: 200, destination_account: 1, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 50, destination_account: 1, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 100, destination_account: 2, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 200, destination_account: 3, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 300, destination_account: 1, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 500, destination_account: 4, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 600, destination_account: 6, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 200, destination_account: 3, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 50, destination_account: 5, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 100, destination_account: 8, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 200, destination_account: 9, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 300, destination_account: 10, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 500, destination_account: 10, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 600, destination_account: 2, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 200, destination_account: 3, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 50, destination_account: 5, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 100, destination_account: 7, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 200, destination_account: 9, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 300, destination_account: 3, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 500, destination_account: 8, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 600, destination_account: 9, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 200, destination_account: 6, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 50, destination_account: 4, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 100, destination_account: 5, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 200, destination_account: 1, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 300, destination_account: 4, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 500, destination_account: 7, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 600, destination_account: 2, responsible_username: 'user2', date_time: new Date(Date.now())},
    ]);
    await Withdrawal.bulkCreate([
        {amount: 200, origin_account: 2, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 200, origin_account: 3, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 200, origin_account: 6, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 200, origin_account: 2, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 200, origin_account: 1, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 200, origin_account: 8, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 200, origin_account: 5, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 200, origin_account: 2, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 200, origin_account: 9, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 200, origin_account: 10, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 200, origin_account: 10, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 200, origin_account: 9, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 200, origin_account: 4, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 200, origin_account: 6, responsible_username: 'user2', date_time: new Date(Date.now())},
        {amount: 200, origin_account: 9, responsible_username: 'user2', date_time: new Date(Date.now())}
    ]);
    await Card_Payment_Log.bulkCreate([
        {id_card: plus_card_offset(1), amount: 10, date_time: new Date(Date.now()), description: 'Sarita Mazatenango: Helado Sarita de chocolate'},
        {id_card: plus_card_offset(0), amount: 10, date_time: new Date(Date.now()), description: 'Sarita Mazatenango: Helado Sarita de vainilla'},
        {id_card: plus_card_offset(1), amount: 10, date_time: new Date(Date.now()), description: 'Sarita Mazatenango: Helado Sarita de fresa'},
        {id_card: plus_card_offset(2), amount: 10, date_time: new Date(Date.now()), description: 'Sarita Quetzaltenango: Helado Sarita de cafe'},
        {id_card: plus_card_offset(3), amount: 10, date_time: new Date(Date.now()), description: 'Sarita Quetzaltenango: Helado Sarita de limon'},
        {id_card: plus_card_offset(4), amount: 10, date_time: new Date(Date.now()), description: 'Sarita Quetzaltenango: Helado Sarita de ron con pasas'},
        {id_card: plus_card_offset(1), amount: 10, date_time: new Date(Date.now()), description: 'Sarita Mazatenango: Helado Sarita de chocolate'},
        {id_card: plus_card_offset(1), amount: 10, date_time: new Date(Date.now()), description: 'Sarita Mazatenango: Helado Sarita de vainilla'},
        {id_card: plus_card_offset(4), amount: 10, date_time: new Date(Date.now()), description: 'Sarita Mazatenango: Helado Sarita de fresa'},
        {id_card: plus_card_offset(5), amount: 10, date_time: new Date(Date.now()), description: 'Sarita Quetzaltenango: Helado Sarita de cafe'},
        {id_card: plus_card_offset(5), amount: 10, date_time: new Date(Date.now()), description: 'Sarita Quetzaltenango: Helado Sarita de limon'},
        {id_card: plus_card_offset(6), amount: 10, date_time: new Date(Date.now()), description: 'Sarita Quetzaltenango: Helado Sarita de ron con pasas'},
        {id_card: plus_card_offset(0), amount: 10, date_time: new Date(Date.now()), description: 'Sarita Mazatenango: Helado Sarita de chocolate'},
        {id_card: plus_card_offset(3), amount: 10, date_time: new Date(Date.now()), description: 'Sarita Mazatenango: Helado Sarita de vainilla'},
        {id_card: plus_card_offset(6), amount: 10, date_time: new Date(Date.now()), description: 'Sarita Mazatenango: Helado Sarita de fresa'},
        {id_card: plus_card_offset(4), amount: 10, date_time: new Date(Date.now()), description: 'Sarita Quetzaltenango: Helado Sarita de cafe'},
        {id_card: plus_card_offset(8), amount: 10, date_time: new Date(Date.now()), description: 'Sarita Quetzaltenango: Helado Sarita de limon'},
        {id_card: plus_card_offset(3), amount: 10, date_time: new Date(Date.now()), description: 'Sarita Quetzaltenango: Helado Sarita de ron con pasas'}
    ]);
    await Loan.bulkCreate([
        {cui: 1000000000004, guarantor_cui: 1000000000006, id_account: 4, amount: 5000, balance: 5500, monthly_payment: 200, interest_rate: 0.3, cutoff_date: '2021-11-02', canceled: false},
        {cui: 1000000000004, guarantor_cui: 1000000000006, id_account: 4, amount: 5000, balance: 5500, monthly_payment: 200, interest_rate: 0.3, cutoff_date: '2021-11-02', canceled: false},
        {cui: 1000000000005, guarantor_cui: 1000000000006, id_account: 4, amount: 5000, balance: 5500, monthly_payment: 200, interest_rate: 0.3, cutoff_date: '2021-11-02', canceled: false},
        {cui: 1000000000006, guarantor_cui: 1000000000007, id_account: 4, amount: 5000, balance: 5500, monthly_payment: 200, interest_rate: 0.3, cutoff_date: '2021-11-02', canceled: false}
    ]);
    await Payment_Log.bulkCreate([
        {id_loan: 1, date: '2021-04-02', amount: 500, balance: 4500, total_payment: 500},
        {id_loan: 1, date: '2021-05-02', amount: 500, balance: 4000, total_payment: 1000},
        {id_loan: 1, date: '2021-06-02', amount: 500, balance: 3500, total_payment: 1500},
        {id_loan: 1, date: '2021-07-02', amount: 500, balance: 3000, total_payment: 2000},
        {id_loan: 1, date: '2021-08-02', amount: 500, balance: 2500, total_payment: 2500},
        {id_loan: 1, date: '2021-09-02', amount: 500, balance: 2000, total_payment: 3000},
        {id_loan: 2, date: '2021-10-02', amount: 500, balance: 1500, total_payment: 3500},
        {id_loan: 2, date: '2021-04-02', amount: 500, balance: 4500, total_payment: 500},
        {id_loan: 2, date: '2021-05-02', amount: 500, balance: 4000, total_payment: 1000},
        {id_loan: 2, date: '2021-06-02', amount: 500, balance: 3500, total_payment: 1500},
        {id_loan: 2, date: '2021-07-02', amount: 500, balance: 3000, total_payment: 2000},
        {id_loan: 2, date: '2021-08-02', amount: 500, balance: 2500, total_payment: 2500},
        {id_loan: 3, date: '2021-04-02', amount: 500, balance: 4500, total_payment: 500},
        {id_loan: 3, date: '2021-05-02', amount: 500, balance: 4000, total_payment: 1000},
        {id_loan: 3, date: '2021-06-02', amount: 500, balance: 3500, total_payment: 1500},
        {id_loan: 3, date: '2021-07-02', amount: 500, balance: 3000, total_payment: 2000},
        {id_loan: 4, date: '2021-08-02', amount: 500, balance: 2500, total_payment: 2500},
        {id_loan: 4, date: '2021-09-02', amount: 500, balance: 2000, total_payment: 3000},
        {id_loan: 4, date: '2021-10-02', amount: 500, balance: 1500, total_payment: 3500}
    ]);
    await Payment_Delay.bulkCreate([
        {id_card: plus_card_offset(0), interest_rate: 0.05, total_debt: 200, canceled: false},
        {id_card: plus_card_offset(1), interest_rate: 0.05, total_debt: 120, canceled: false}
    ]);
    res.send('Base de datos sincronizada');
};

const view_all = async (req, res) => {
    var promises = [];
    promises.push(Card_Cancellation_Request.findAll({raw: true}));
    promises.push(Account_Request.findAll({raw: true}));
    promises.push(Credit_Card_Request.findAll({raw: true}));
    promises.push(Debit_Card_Request.findAll({raw: true}));
    promises.push(Update_Data_Request.findAll({raw: true}));
    promises.push(Loan_Request.findAll({raw: true}));
    promises.push(Account_Type.findAll({raw: true}));
    promises.push(Account.findAll({raw: true}));
    promises.push(Active_Session_Log.findAll({raw: true}));
    promises.push(Bank_User_Type.findAll({raw: true}));
    promises.push(Bank_User.findAll({raw: true}));
    promises.push(Card_Payment_Log.findAll({raw: true}));
    promises.push(Card.findAll({raw: true}));
    promises.push(Credit_Card_Type.findAll({raw: true}));
    promises.push(Credit_Card.findAll({raw: true}));
    promises.push(Debit_Card.findAll({raw: true}));
    promises.push(Deposit.findAll({raw: true}));
    promises.push(Email.findAll({raw: true}));
    promises.push(Loan.findAll({raw: true}));
    promises.push(Person.findAll({raw: true}));
    promises.push(Request.findAll({raw: true}));
    promises.push(Withdrawal.findAll({raw: true}));
    promises.push(Payment_Log.findAll({raw: true}));
    promises.push(Payment_Delay.findAll({raw: true}));
    promises.push(Authorized_Institution.findAll({raw: true}));
    Promise.all(promises).then(result => {
        res.status(200).json({
            card_cancellation_request: result[0],
            account_request: result[1],
            credit_card_request: result[2],
            debit_card_request: result[3],
            update_data_request: result[4],
            loan_request: result[5],
            account_type: result[6],
            account: result[7],
            active_session_log: result[8],
            bank_user_type: result[9],
            bank_user: result[10],
            card_payment_log: result[11],
            card: result[12],
            credit_card_type: result[13],
            credit_card: result[14],
            debit_card: result[15],
            deposit: result[16],
            email: result[17],
            loan: result[18],
            person: result[19],
            request: result[20],
            withdrawal: result[21],
            payment_log: result[22],
            payment_delay: result[23],
            authorized_institutions: result[24]
        });
    });
};

module.exports = {
    syncronization,
    view_all
}