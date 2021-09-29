const authentication_conf = require("../confs/config"); //Aquí será para usar la llave básica de encriptación
const jwt = require('jsonwebtoken'); //Indicamos que usaremos JsonWebToken
const bcrypt = require("bcrypt");

const { getUserByUsername } = require("../models/user");
const { saveActiveSession, getActiveSessionByUsername, getActiveSessionByToken, deleteActiveSession } = require('../models/active_session_log');

/**
 * @description Method that verifies if another session is active and create a new session if there is no one existing.
 * @param req.body.username username of the user
 * @param req.body.password password of the user
 */
const login = async (req, res) => {
    const user = await getUserByUsername(req.body.username);
    if(user != undefined){
        if(await bcrypt.compare(req.body.password,user.password)){
            if((await getActiveSessionByUsername(user.username)) != undefined){
                res.status(403).json({error:"Ya se encuentra una sesion activa para el usuario "+req.body.username});
            }else{
                const token = jwt.sign({user_type: user.user_type}, authentication_conf.key);
                saveActiveSession(user.username,token);
                res.status(200).json({username: user.username,user_type: user.user_type, token: token});
            }
        }else{
            res.status(403).json({error:"La contraseña proporcionada no es la correcta"});
        }
    }else{
        res.status(403).json({error:"El usuario "+req.body.username+" no se encuentra registrado."});
    }
};

/**
 * @description Method for delete the current active session in the database for an user
 * @param req.body.token Authentication token
 */
const logout = async (req, res) => {
    const authentication_token = await getActiveSessionByToken(req.body.token);
    if(authentication_token != undefined){
        await deleteActiveSession(authentication_token.token);
        res.status(200).json({mensaje:"Se ha cerrado sesion correctamente."});
    }else{
        res.status(403).json({error:"El token que posee ha expirado, inicie sesion nuevamente."});
    }
};

module.exports = {
    login,
    logout
}