const { Router } = require('express'); //Que usaremos la funcion Router, del paquete express
const router = Router(); //Creamos un router

const { transfer_on_app, account_statement } = require('../controllers/account_controller');

router.post('/account/transfer_on_app', transfer_on_app);
router.get('/account/statement', account_statement);

module.exports = router;