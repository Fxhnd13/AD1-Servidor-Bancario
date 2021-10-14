const { Router } = require('express'); //Que usaremos la funcion Router, del paquete express
const router = Router(); //Creamos un router

const { transfer_on_app } = require('../controllers/account_controller');

router.post('/account/transfer_on_app', transfer_on_app);

module.exports = router;