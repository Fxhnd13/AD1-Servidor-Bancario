const { Router } = require('express'); //Que usaremos la funcion Router, del paquete express
const router = Router(); //Creamos un router

const { create_loan_request, create_card_cancellation_request, create_update_data_request, create_account_request, create_debit_card_request, create_credit_card_request, get_all_request, get_request_between_two_dates } = require('../controllers/client_request_controller');

router.post('/request/credit_card', create_credit_card_request); //Al hacer post en esa ruta se crea un usuario
router.post('/request/debit_card', create_debit_card_request); //Al hacer post en esa ruta se crea un usuario
router.post('/request/account', create_account_request); //Al hacer post en esa ruta se crea un usuario
router.post('/request/update_data', create_update_data_request); //Al hacer post en esa ruta se crea un usuario
router.post('/request/card_cancellation', create_card_cancellation_request); //Al hacer post en esa ruta se crea un usuario
router.post('/request/loan', create_loan_request); //Al hacer post en esa ruta se crea un usuario

router.get('/request/get_all', get_all_request);
router.get('/request/get_between_two_dates', get_request_between_two_dates);

module.exports = router;