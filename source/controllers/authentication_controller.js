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
    Bank_User.findOne({where:{username: req.body.username}, raw: true}).then(user =>{
        if(user == null){
            res.status(403).json({information_message:"El usuario "+req.body.username+" no se encuentra registrado"});
        }else{
            if(user.access){
                bcrypt.compare(req.body.password,user.password).then(areEqual =>{
                    if(areEqual){
                        Active_Session_Log.findOne({where:{username: req.body.username}}).then(session =>{
                            if(session == null){
                                const token = jwt.sign({user_type: user.user_type}, authentication_conf.key);
                                Active_Session_Log.create({username: user.username, token: token}).then(()=>{
                                    res.status(200).json({username: user.username,user_type: user.user_type, token: token});
                                });
                            }else{
                                session.destroy();
                                const token = jwt.sign({user_type: user.user_type}, authentication_conf.key);
                                Active_Session_Log.create({username: user.username, token: token}).then(()=>{
                                    res.status(200).json({username: user.username,user_type: user.user_type, token: token});
                                });
                            }
                        });
                    }else{
                        res.status(403).json({information_message:"La contraseña proporcionada no es la correcta."});
                    }
                });
            }else{
                res.status(403).json({information_message: 'Esta cuenta ya no posee acceso al sistema bancario.'});
            }
        }
    });
};

/**
 * @description Method for delete the current active session in the database for an user
 * @param req.body.token Authentication token
 */
const logout = async (req, res) => {
    Active_Session_Log.findOne({where:{token: req.headers.token }}).then(session=>{
        if(session == null){
            res.status(401).json({information_message:"El token que posee ha expirado, inicie sesion nuevamente."});
        }else{
            session.destroy();
            res.status(200).json({information_message:"Se ha cerrado sesion correctamente."});
        }

    });
};

const generate_password = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

module.exports = {
    login,
    logout,
    generate_password
}