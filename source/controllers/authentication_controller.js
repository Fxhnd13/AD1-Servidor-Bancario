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
            res.status(403).json({message:"El usuario "+req.body.username+" no se encuentra registrado."});
        }else{
            bcrypt.compare(req.body.password,user.password).then(areEqual =>{
                if(areEqual){
                    if(is_logged_in){
                        const token = jwt.sign({user_type: user.user_type}, authentication_conf.key);
                        Active_Session_Log.create({username: user.username, token: token});
                        res.status(200).json({username: user.username,user_type: user.user_type, token: token});
                    }else{
                        res.status(403).json({message:"Ya se encuentra una sesion activa para el usuario "+req.body.username});
                    }
                }else{
                    res.status(403).json({message:"La contraseña proporcionada no es la correcta"});
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
    //Active_Session_Log.findOne({where:{token:req.body.token}}).then(session=>{
    Active_Session_Log.findOne({where:{token: req.headers.token }}).then(session=>{
        if(session == null){
            res.status(401).json({information_message:"El token que posee ha expirado, inicie sesion nuevamente."});
        }else{
            session.destroy();
            res.status(200).json({information_message:"Se ha cerrado sesion correctamente."});
        }

    });
};

const is_logged_in = (req, res) => {
    //Active_Session_Log.findOne({where: {token: req.body.token}}).then(session=>{
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session=>{
        if(session == null){
            return false;
        }else{
            return true;
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