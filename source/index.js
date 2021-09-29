const express = require('express'); //Indicamos que usaremos express
const app = express(); //Inicializamos una 'variable'

app.use(express.json());//middleware -> Como se van a comunicar con este servidor, habilitamos json's
app.use(express.urlencoded({extended: false})); //Indicamos que no se admitiran formularios complejos (imagenes, etc)

//Indicamos la ubicacion de las rutas
app.use(require('./routes/userRoutes')); //Rutas para el manejo de usuarios
app.use(require('./routes/authenticationRoutes')); //Rutas para el manejo de autenticacion inicial

app.listen(3000); //Puerto en el que levantaremos el servidor
console.log('*******************************'); //Se muestra en la terminal en la que montamos el servidor
console.log('*****Servidor iniciado*********');
console.log('*******************************');