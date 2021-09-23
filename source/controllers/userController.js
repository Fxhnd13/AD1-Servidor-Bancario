const { response } = require('express');
const credentialsDb = require('../db/credentials');
//const session = credentialsDb.session; aquí podemos usar esto para sólo modificar las credenciales en /db/credentials

const createUser = async (req, res) => {
    res.send("Se ha creado un usuario.");
};

const getUser = async (req, res) => {
    res.send("Se ha obtenido un usuario");
};

const updateUser = async (req, res) => {
    res.send("Se ha actualizado a un usuario.");
};

const deleteUser = async (req,res) => {
    res.send(`Se ha eliminado el usuario con id: ${req.params.id}`);
};

const login = async (req, res) => {
    res.send("Se ha iniciado sesión correctamente.");
};

const logout = async (req, res) => {
    res.send("Se ha eliminado la sesión activa, ya puede iniciar sesion en otro dispositivo.");
};

module.exports = {
    createUser,
    getUser,
    updateUser,
    deleteUser,
    login,
    logout
};