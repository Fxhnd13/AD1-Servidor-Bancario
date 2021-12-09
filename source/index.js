const express = require('express'); //Indicamos que usaremos express
const app = express(); //Inicializamos una 'variable'
const swagger_ui = require('swagger-ui-express');
const swagger_doc = require('../doc/swagger.json');
const cors = require('cors');
var cron = require('node-cron');

const { loan_verification } = require('./controllers/loan_controller');
const { credit_card_verfication } = require('./controllers/card_controller');
const { payment_delay_verification } = require('./controllers/payment_delay_controller');
const { update_data_reminder_verification } = require('./controllers/person_controller');
const { update_password_reminder_verification } = require('./controllers/user_controller');
const { account_verification } = require('./controllers/account_controller');

app.use(express.json());//middleware -> Como se van a comunicar con este servidor, habilitamos json's
app.use(express.urlencoded({extended: false})); //Indicamos que no se admitiran formularios complejos (imagenes, etc)
app.use(cors());
app.use('/api-docs', swagger_ui.serve, swagger_ui.setup(swagger_doc));

//Indicamos la ubicacion de las rutas
app.use(require('./routes/user_routes')); //Rutas para el manejo de usuarios
app.use(require('./routes/authentication_routes')); //Rutas para el manejo de autenticacion inicial
app.use(require('./routes/person_routes'));
app.use(require('./routes/client_request_routes'));
app.use(require('./routes/db_routes'));
app.use(require('./routes/email_routes'));
app.use(require('./routes/account_routes'));
app.use(require('./routes/loan_routes'));
app.use(require('./routes/card_routes'));
app.use(require('./routes/service_routes'));

app.listen(process.env.PORT || 3000); //Puerto en el que levantaremos el servidor
console.log('*******************************'); //Se muestra en la terminal en la que montamos el servidor
console.log('*****Servidor iniciado*********');
console.log('*******************************');

//Cosas a verificar día con día
cron.schedule('0 0 0 * * *', () => {
  loan_verification();
  credit_card_verfication();
  payment_delay_verification();
  update_data_reminder_verification();
  update_password_reminder_verification();
});

//Cosas a realizar una vez al año
cron.schedule('0 0 0 1 1 *', () => {
  account_verification();
});
