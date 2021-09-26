const { Router } = require('express'); //Que usaremos la funcion Router, del paquete express
const router = Router(); //Creamos un router

//Importamos las funciones de userConroller que usaremos
const { login, createUser, logout, updateUser } = require('../controllers/userController');

router.get('/login', login); //Al hacer un get en esta ubicacion se ejecuta el metodo login
router.get('/logout', logout); //Al hacer un get desde esta ruta se ejecuta el metodo logout
router.post('/user', createUser); //Al hacer post en esa ruta se crea un usuario
router.put('/user', updateUser); //Al hacer put en esa ruta se actualiza un usuario
//router.delete('/user', deleteUser); //Al hacer delete en esta ruta, se eliminará un usuario


/*router.get('/users/:id', getuserById);
router.delete('/users/:id', deleteUser);*/

module.exports = router;