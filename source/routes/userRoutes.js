const { Router } = require('express'); //Que usaremos la funcion Router, del paquete express
const router = Router(); //Creamos un router

//Importamos las funciones de userConroller que usaremos
const { createUser, updateUserPassword } = require('../controllers/userController');

router.post('/user', createUser); //Al hacer post en esa ruta se crea un usuario
router.put('/user', updateUserPassword); //Al hacer put en esa ruta se actualiza un usuario

module.exports = router;