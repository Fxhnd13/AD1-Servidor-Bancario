var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'AD1.Bank.Server@gmail.com',
    pass: 'ad1bankserver'
  }
});

var mailOptions = {
  from: 'AD1.Bank.Server@gmail.com',
  to: 'eurojcsr13@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

const send_test_email = async(req, res) =>{
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    }); 
};

module.exports = {
    send_test_email
}