var nodemailer = require('nodemailer');
const { Account } = require('../models/account');
const { Bank_User } = require('../models/bank_user');
const { Email } = require('../models/email');
const sender = 'AD1.Bank.Server@gmail.com';

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'AD1.Bank.Server@gmail.com',
    pass: 'ad1bankserver'
  }
});

const send_email = async(mailOptions) =>{
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email enviado: ' + info.response);
        }
    }); 
};

const send_password_recovery_email = (email, password) => {
  var mailOptions = {
    from: sender,
    to: email,
    subject: 'Recuperación de contraseña',
    text: 'Se ha solicitado una recuperacion de contraseña.\n La nueva contraseña es: '+password+'\n Si usted no ha solicitado esta recuperacion de contraseña dirijase a su centro bancario más cercano.'
  }
  send_email(mailOptions);
};

const send_deposit_email = (email, destination_account, amount, date_time) => {
  var mailOptions = {
    from: sender,
    to: email,
    subject: 'Deposito bancario',
    text: 'Se ha realizado un deposito en su cuenta No. '+destination_account+', una cantidad de Q '+amount+' con fecha y hora equivalentes a '+date_time
  }
  send_email(mailOptions);
};

const send_withdrawal_email = (email, origin_account, amount, date_time) => {
  var mailOptions = {
    from: sender,
    to: email,
    subject: 'Retiro bancario',
    text: 'Se ha realizado un retiro de su cuenta No. '+origin_account+', una cantidad de Q '+amount+' con fecha y hora equivalentes a '+date_time
  }
  send_email(mailOptions);
};

const send_transfer_email = (transfer) => {
  Account.findOne({where: {id_account: transfer.origin_account}, raw: true}).then(origin_account => {
    Bank_User.findOne({where: {cui: origin_account.cui}, raw: true}).then(bank_user =>{
      Email.findOne({where: {username: bank_user.username}, raw: true}).then(email => {
        send_withdrawal_email(email.email, origin_account.id_account, transfer.amount, transfer.date_time);
      });
    });
  });
  Account.findOne({where: {id_account: transfer.destination_account}, raw: true}).then(destination_account => {
    Bank_User.findOne({where: {cui: origin_account.cui}, raw: true}).then(bank_user =>{
      Email.findOne({where: {username: bank_user.username}, raw: true}).then(email => {
        send_deposit_email(email.email, destination_account.id_account, transfer.amount, transfer.date_time);
      });
    });
  });
}

module.exports = {
    send_password_recovery_email,
    send_deposit_email,
    send_withdrawal_email,
    send_transfer_email
}