const { Active_Session_Log } = require('../models/active_session_log');
const { Account } = require('../models/account');
const { Bank_User } = require('../models/bank_user');

const bcrypt = require("bcrypt");
var BCRYPT_SALT_ROUNDS = 3;

/**
 * @description Method that receives all the user information for create a new one
 * @param req.body.username Username for the new user
 * @param req.body.password Password for the new user
 * @param req.body.user_type Type for the new user
 * @param req.body.cui Cui from the new user
 */
const create_user = async(req, res) => {
    Bank_User.findOne({ where: { username: req.body.username } }).then(user => {
        if(user == null){
            bcrypt.hash(req.body.password,BCRYPT_SALT_ROUNDS).then(hashed_password => {
                if(req.body.user_type == 1){
                    Account.count({ where: { cui: req.body.cui }}).then(accounts => {
                        if(accounts > 0){
                            Bank_User.create({ username: req.body.username, password: hashed_password, user_type: req.body.user_type, cui: req.body.cui });
                            res.status(200).json({information_message:"Se ha creado su usuario correctamente."});
                        }else{
                            res.status(400).json({information_message:"No existe una cuenta bancaria ligada a su persona."});
                        }
                    });
                }else{
                    Active_Session_Log.findOne({where: {token: req.headers.token}}).then(session=>{
                        if(session == null){
                            res.status(401).json({information_message: "El token que posee ha expirado, inicie sesion nuevamente."})
                        }else{
                            Bank_User.findOne({where: {username: session.username}}).then(bank_user=>{
                            if(bank_user.user_type >=3 ){
                                Bank_User.create({ username: req.body.username, password: hashed_password, user_type: req.body.user_type, cui: req.body.cui });
                                res.status(200).json({information_message:"Se ha creado su usuario correctamente."});
                            }
                        });
                        }
                    });
                }
            });
        }else{
            res.status(400).json({information_message:"Ya existe un usuario con ese nombre."});
        }
    });
};

/**
 * @description Method that receives a new password and an old one, so one user can update her password.
 * @param req.body.token Authentication token
 * @param req.body.old_password Password for verify the identity of the user
 * @param req.body.new_password New password to save in the database
 */
const update_user_password = async (req, res) => {
    //Active_Session_Log.findOne({ where: { token: req.body.token } }).then(session => {
    Active_Session_Log.findOne({where: {token: req.headers.token}}).then(session=>{
        if(session == null){
            res.status(401).json({information_message:"El token que posee ha expirado, inicie sesion nuevamente."});
        }else{
            Bank_User.findOne({ where: { username: session.username } }).then(user => {
                bcrypt.compare(req.body.old_password, user.password).then(areEqual => {
                    if(areEqual){
                        if(req.body.new_password === req.body.old_password){
                            res.status(403).json({information_message:"La nueva contraseña es igual a la anterior, no se realizaron modificacioens."});
                        }else{
                            bcrypt.hash(req.body.new_password, BCRYPT_SALT_ROUNDS).then(hashed_password => {
                                user.update({ password: hashed_password });
                                res.status(200).json({information_message:"Se ha actualizado la contraseña correctamente."});
                            });
                        }
                    }else{
                        res.status(403).json({information_message:"La contraseña ingresada no es correcta."});
                    }
                });
            });
        }
    });
};

module.exports = {
    create_user,
    update_user_password
};