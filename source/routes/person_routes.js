const { Router } = require('express'); //Que usaremos la funcion Router, del paquete express
const router = Router(); //Creamos un router

const { create_person, update_person } = require('../controllers/person_controller');

router.post('/person', create_person); //Al hacer post en esa ruta se crea un usuario
router.put('/person', update_person); //Al hacer put en esa ruta se actualiza un usuario

module.exports = router;