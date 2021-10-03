const authentication_conf = require("../confs/config"); //Aquí será para usar la llave básica de encriptación
const jwt = require('jsonwebtoken'); //Indicamos que usaremos JsonWebToken
const bcrypt = require("bcrypt");

const { Bank_User } = require('../models/bank_user');
const { Active_Session_Log } = require('../models/active_session_log');

/**
 * @description Method that verifies if another session is active and create a new session if there is no one existing.
 * @param req.body.username username of the user
 * @param req.body.password password of the user
 */
const login = async (req, res) => {
    Bank_User.findOne({where:{username: req.body.username}}).then(user =>{
        if(user == null){
            res.status(403).json({error:"El usuario "+req.body.username+" no se encuentra registrado."});
        }else{
            bcrypt.compare(req.body.password,user.password).then(areEqual =>{
                if(areEqual){
                    Active_Session_Log.findOne({where:{username: user.username}}).then(session => {
                        if(session == null){
                            const token = jwt.sign({user_type: user.user_type}, authentication_conf.key);
                            Active_Session_Log.create({username: user.username, token: token});
                            res.status(200).json({username: user.username,user_type: user.user_type, token: token});
                        }else{
                            res.status(403).json({error:"Ya se encuentra una sesion activa para el usuario "+req.body.username});
                        }
                    });
                }else{
                    res.status(403).json({error:"La contraseña proporcionada no es la correcta"});
                }
            });
        }
    });
};

/**
 * @description Method for delete the current active session in the database for an user
 * @param req.body.token Authentication token
 */
const logout = async (req, res) => {
    Active_Session_Log.findOne({where: {token: req.body.token}}).then(session => {
        if(session == null){
            res.status(403).json({error:"El token que posee ha expirado, inicie sesion nuevamente."});
        }else{
            session.destroy();
            res.status(200).json({mensaje:"Se ha cerrado sesion correctamente."});
        }
    });
};

module.exports = {
    login,
    logout
}