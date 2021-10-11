var nodemailer = require('nodemailer');
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

module.exports = {
    send_test_email,
    send_password_recovery_email
}