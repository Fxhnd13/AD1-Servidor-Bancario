var nodemailer = require('nodemailer');
const { Account } = require('../models/account');
const { Bank_User } = require('../models/bank_user');
const { Email } = require('../models/email');
const { Withdrawal } = require('../models/withdrawal');
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

const send_deposit_email = (deposit) => {
  Account.findOne({where: {id_account: deposit.destination_account}, raw: true}).then(destination_account => {
    Bank_User.findOne({where: {cui: destination_account.cui}, raw: true}).then(bank_user =>{
      Email.findOne({where: {username: bank_user.username}, raw: true}).then(email => {
        var mailOptions = {
          from: sender,
          to: email.email,
          subject: 'Deposito bancario',
          text: 'Se ha realizado un deposito en su cuenta No. '+destination_account.id_account+', una cantidad de Q '+deposit.amount+' con fecha y hora equivalentes a '+deposit.date_time
        }
        send_email(mailOptions);
      });
    });
  });
};

const send_withdrawal_email = (withdrawal) => {
  Account.findOne({where: {id_account: withdrawal.origin_account}, raw: true}).then(origin_account => {
    Bank_User.findOne({where: {cui: origin_account.cui}, raw: true}).then(bank_user =>{
      Email.findOne({where: {username: bank_user.username}, raw: true}).then(email => {
        var mailOptions = {
          from: sender,
          to: email.email,
          subject: 'Retiro bancario',
          text: 'Se ha realizado un retiro de su cuenta No. '+origin_account.id_account+', una cantidad de Q '+withdrawal.amount+' con fecha y hora equivalentes a '+withdrawal.date_time
        }
        send_email(mailOptions);
      });
    });
  });
};

module.exports = {
    send_password_recovery_email,
    send_deposit_email,
    send_withdrawal_email
}