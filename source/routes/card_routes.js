const { Router } = require('express'); //Que usaremos la funcion Router, del paquete express
const router = Router(); //Creamos un router

const { card_statement, create_card, card_cancellation, do_payment } = require('../controllers/card_controller');

router.get('/card/statement', card_statement);
router.post('/card', create_card);
router.post('/card/cancellation', card_cancellation);
router.post('/card/payment', do_payment);

module.exports = router;