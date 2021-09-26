const { response } = require('express');
const accessDb = require('../db/credentials'); //Variable de acceso a la base de datos

const login = async (req, res) => {
    res.send("Se ha iniciado sesión correctamente.");
};

const logout = async (req, res) => {
    res.send("Se ha eliminado la sesión activa, ya puede iniciar sesion en otro dispositivo.");
};

const createUser = (req, res) => {
    accessDb.db.collection('user').doc('prueba').set({
        username: req.body.username,
        password: req.body.password,
        user_type: req.body.user_type,
        cui: req.body.cui
    });
    res.send("Se ha creado un usuario.");
};

const updateUser = async (req, res) => {
    res.send("Se ha actualizado a un usuario.");
};

module.exports = {
    login,
    logout,
    createUser,
    updateUser
};