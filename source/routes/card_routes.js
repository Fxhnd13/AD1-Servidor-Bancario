const { Router } = require('express'); //Que usaremos la funcion Router, del paquete express
const router = Router(); //Creamos un router

const { card_statement } = require('../controllers/card_controller');

router.get('/card/statement', card_statement);

module.exports = router;