const { Router } = require('express'); //Que usaremos la funcion Router, del paquete express
const router = Router(); //Creamos un router

const { loan_statement, create_loan, get_all_loans, get_loan_by_id, update_loan, do_loan_payment_to_bank } = require('../controllers/loan_controller');

router.get('/loan/statement', loan_statement);
router.post('/loan', create_loan);
router.get('/loan', get_loan_by_id);
router.put('/loan', update_loan);
router.get('/loan/all', get_all_loans);
router.post('/loan/payment', do_loan_payment_to_bank);

module.exports = router;