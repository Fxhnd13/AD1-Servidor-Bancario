const { Router } = require('express'); //Que usaremos la funcion Router, del paquete express
const router = Router(); //Creamos un router

const { login, logout } = require("../controllers/authentication_controller");

router.post('/login', login); //Al hacer un get en esta ubicacion se ejecuta el metodo login
router.post('/logout', logout); //Al hacer un get desde esta ruta se ejecuta el metodo logout

module.exports = router;