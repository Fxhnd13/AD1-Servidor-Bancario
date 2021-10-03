const { Router } = require('express'); //Que usaremos la funcion Router, del paquete express
const router = Router(); //Creamos un router

const {} = require('../controllers/client_request_controller');

router.post('/request', create_request); //Al hacer post en esa ruta se crea un usuario

module.exports = router;