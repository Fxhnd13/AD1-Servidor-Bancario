const { Router } = require('express'); //Que usaremos la funcion Router, del paquete express
const router = Router(); //Creamos un router

const { transfer_on_app, account_statement, account_avaliable_for_debit_card } = require('../controllers/account_controller');

router.post('/account/transfer_on_app', transfer_on_app);
router.get('/account/statement', account_statement);
router.get('/account/avaliable_for_debit_card', account_avaliable_for_debit_card);

module.exports = router;