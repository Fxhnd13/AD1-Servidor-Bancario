const { Router } = require('express'); //Que usaremos la funcion Router, del paquete express
const router = Router(); //Creamos un router

const { create_request, get_all_request, get_request_between_two_dates } = require('../controllers/client_request_controller');

router.post('/request', create_request); //Al hacer post en esa ruta se crea un usuario
router.get('/all_request', get_all_request);
router.get('/all_request_between_two_dates', get_request_between_two_dates);

module.exports = router;