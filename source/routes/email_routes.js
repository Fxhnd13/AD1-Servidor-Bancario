const { Router } = require('express'); //Que usaremos la funcion Router, del paquete express
const router = Router(); //Creamos un router

//Importamos las funciones de userConroller que usaremos
const { send_test_email } = require('../controllers/email_controller');

router.post('/email', send_test_email); //Al hacer post en esa ruta se crea un usuario

module.exports = router;