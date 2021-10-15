const { Router } = require('express'); //Que usaremos la funcion Router, del paquete express
const router = Router(); //Creamos un router

const { loan_statement } = require('../controllers/loan_controller');

router.get('/loan/statement', loan_statement);

module.exports = router;