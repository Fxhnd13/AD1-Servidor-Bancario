const { Router } = require('express'); //Que usaremos la funcion Router, del paquete express
const router = Router(); //Creamos un router

//Importamos las funciones de userConroller que usaremos
const { active_services } = require('../models/service_controller');

router.get('/services/active', active_services);

module.exports = router;