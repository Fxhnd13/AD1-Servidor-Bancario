const { Router } = require('express'); //Que usaremos la funcion Router, del paquete express
const router = Router(); //Creamos un router

const { transfer_on_app, account_statement, account_available_for_debit_card, create_account, get_all_accounts, get_account_by_id, update_account,do_withdrawal, do_deposit } = require('../controllers/account_controller');

router.post('/account/transfer_on_app', transfer_on_app);
router.get('/account/statement', account_statement);
router.get('/account/available_for_debit_card', account_available_for_debit_card);
router.post('/account/create', create_account);
router.get('/account/all', get_all_accounts);
router.get('/account', get_account_by_id);
router.put('/account', update_account);
router.post('/account/deposit', do_deposit);
router.post('/account/withdrawal', do_withdrawal);

module.exports = router;