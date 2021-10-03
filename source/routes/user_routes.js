const { Router } = require('express'); //Que usaremos la funcion Router, del paquete express
const router = Router(); //Creamos un router

//Importamos las funciones de userConroller que usaremos
const { create_user, update_user_password } = require('../controllers/user_controller');

router.post('/user', create_user); //Al hacer post en esa ruta se crea un usuario
router.put('/user', update_user_password); //Al hacer put en esa ruta se actualiza un usuario

module.exports = router;