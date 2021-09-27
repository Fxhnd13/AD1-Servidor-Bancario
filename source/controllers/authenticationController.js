const authenticationConf = require("../confs/config"); //Aquí será para usar la llave básica de encriptación
const jwt = require('jsonwebtoken'); //Indicamos que usaremos JsonWebToken
const bcrypt = require("bcrypt");

const { getUserByUsername } = require("../models/user");
const { saveActiveSession, getActiveSessionByUsername, getActiveSessionByToken, deleteActiveSession } = require('../models/active_session_log');

const login = async (req, res) => {
    const user = await getUserByUsername(req.body.username);
    if(user != undefined){
        if(await bcrypt.compare(req.body.password,user.password)){
            if((await getActiveSessionByUsername(user.username)) != undefined){
                res.status(403).json({token:"", error:"Ya se encuentra una sesion activa para el usuario "+req.body.username});
            }else{
                const token = jwt.sign({userType: user.userType}, authenticationConf.key);
                saveActiveSession(user.username,token);
                res.status(200).json({token: token, error:""});
            }
        }else{
            res.status(403).json({token:"", error:"La contraseña proporcionada no es la correcta"});
        }
    }else{
        res.status(403).json({token:"", error:"El usuario "+req.body.username+" no se encuentra registrado."});
    }
};

const logout = async (req, res) => {
    const authenticationToken = await getActiveSessionByToken(req.body.token);
    if(authenticationToken != undefined){
        await deleteActiveSession(authenticationToken.token);
        res.status(200).json({mensaje:"Se ha cerrado sesion correctamente."});
    }else{
        res.status(403).json({error:"El token que posee ha expirado, inicie sesion nuevamente."});
    }
};

module.exports = {
    login,
    logout
}