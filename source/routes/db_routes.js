const { Router } = require('express'); //Que usaremos la funcion Router, del paquete express
const router = Router(); //Creamos un router

//Importamos las funciones de userConroller que usaremos
const { syncronization, view_all } = require('../models/models_creation');

router.post('/db', syncronization); //Al hacer post en esa ruta se crea un usuario
router.post('/db/view_all', view_all);

module.exports = router;