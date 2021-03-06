const { Active_Session_Log } = require('../models/active_session_log');
const { Account } = require('../models/account');
const { Bank_User } = require('../models/bank_user');
const { Email } = require('../models/email');
const { Op } = require('sequelize');
const { generate_password } = require('./authentication_controller');
const { send_password_recovery_email } = require('./email_controller');

const bcrypt = require("bcrypt");
const { print_user_type, is_six_months_earlier, has_admin_access } = require('./utilities_controller');
var BCRYPT_SALT_ROUNDS = 3;

/**
 * @description Method that receives all the user information for create a new one
 * @param req.body.username Username for the new user
 * @param req.body.password Password for the new user
 * @param req.body.user_type Type for the new user
 * @param req.body.cui Cui from the new user
 */
const create_user = async(req, res) => {
    Bank_User.findOne({ where: { [Op.or]: [{ username: req.body.username},{[Op.and]:[{cui: req.body.cui},{user_type: req.body.user_type}]}]}, raw: true}).then(user => {
        if(user == null){
            bcrypt.hash(req.body.password,BCRYPT_SALT_ROUNDS).then(hashed_password => {
                if(req.body.user_type == 1){
                    Account.count({ where: { cui: req.body.cui }}).then(accounts => {
                        if(accounts > 0){
                            Bank_User.create({ username: req.body.username, password: hashed_password, user_type: req.body.user_type, cui: req.body.cui, access: true, last_update_date: new Date(Date.now())});
                            Email.create({ username: req.body.username, email: req.body.email });
                            res.status(200).json({information_message:"Se ha creado su usuario correctamente."});
                        }else{
                            res.status(400).json({information_message:"No existe una cuenta bancaria ligada a su persona."});
                        }
                    });
                }else{
                    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session=>{
                        if(session == null){
                            res.status(401).json({information_message: "El token que posee ha expirado, inicie sesion nuevamente."})
                        }else{
                            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user=>{
                            if(has_admin_access(bank_user.user_type)){
                                Bank_User.create({ username: req.body.username, password: hashed_password, user_type: req.body.user_type, cui: req.body.cui, access: true});
                                Email.create({ username: req.body.username, email: req.body.email });
                                res.status(200).json({information_message:"Se ha creado su usuario correctamente."});
                            }
                        });
                        }
                    });
                }
            });
        }else{
            res.status(400).json({information_message:"Ya existe un usuario con ese nombre o su persona ya posee una cuenta del tipo deseado."});
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
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session=>{
        if(session == null){
            res.status(401).json({information_message:"El token que posee ha expirado, inicie sesion nuevamente."});
        }else{
            Bank_User.findOne({ where: { username: session.username } }).then(user => {
                bcrypt.compare(req.body.old_password, user.password).then(areEqual => {
                    if(areEqual){
                        if(req.body.new_password === req.body.old_password){
                            res.status(403).json({information_message:"La nueva contrase??a es igual a la anterior, no se realizaron modificacioens."});
                        }else{
                            bcrypt.hash(req.body.new_password, BCRYPT_SALT_ROUNDS).then(hashed_password => {
                                user.update({ password: hashed_password, last_update_date: new Date(Date.now()) });
                                res.status(200).json({information_message:"Se ha actualizado la contrase??a correctamente."});
                            });
                        }
                    }else{
                        res.status(403).json({information_message:"La contrase??a ingresada no es correcta."});
                    }
                });
            });
        }
    });
};

const password_recovery = (req, res) => {
    Email.findOne({ where: {username: req.body.username}, raw: true }).then(email=>{
        if(email == null){
            res.status(404).json({information_message: 'El usuario que ingres?? no se encuentra registro en la base de datos'});
        }else{
            const new_password = generate_password(8);
            bcrypt.hash(new_password,BCRYPT_SALT_ROUNDS).then(hashed_password => {
                Bank_User.findOne({ where: { username: req.body.username }}).then(bank_user=>{
                    bank_user.update({password: hashed_password, last_update_date: new Date(Date.now())});
                    send_password_recovery_email(email, new_password);
                    res.status(200).json({information_message: 'Se ha cambiado la contrase??a con ??xito, por favor, revise su correo electronico.'});
                });
            });
        }
    });
};

const get_all_users = (req, res) => {
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session=>{
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user=>{
                if(has_admin_access(bank_user.user_type)){
                    Bank_User.findAll().then(users=>{
                        let result = [];
                        users.forEach(user=>{
                            result.push({
                                username: user.username,
                                user_type: user.user_type,
                                user_type_description: print_user_type(user.user_type),
                                cui: user.cui,
                                access: user.access,
                                last_update_date: user.last_update_date
                            })
                        });
                        res.status(200).json(result);
                    });
                }else{
                    res.status(403).json({information_message: 'No tienes permiso para realizar esta acci??n.'});
                }
            });
        }
    });
};

const get_bank_users = (req, res) => {
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session=>{
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user=>{
                if(has_admin_access(bank_user.user_type)){
                    Bank_User.findAll({where:{user_type: {[Op.gt]: 1, [Op.lt]: 4}}}).then(users=>{
                        let result = [];
                        users.forEach(user=>{
                            result.push({
                                username: user.username,
                                user_type: user.user_type,
                                user_type_description: print_user_type(user.user_type),
                                cui: user.cui,
                                access: user.access,
                                last_update_date: user.last_update_date
                            })
                        });
                        res.status(200).json(result);
                    });
                }else{
                    res.status(403).json({information_message: 'No tienes permiso para realizar esta acci??n.'});
                }
            });
        }
    });
};

const revoke_access = (req, res) => {
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session=>{
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user=>{
                if(has_admin_access(bank_user.user_type)){
                    Bank_User.findOne({where: {username: req.body.username}}).then(bank_user_to_revoke_access=>{
                        bank_user_to_revoke_access.update({access: false}).then(()=>{
                            Active_Session_Log.findOne({where: {username: req.body.username}}).then(bank_user_session=>{
                                if(bank_user_session != null) bank_user_session.destroy();
                            });
                            res.status(200).json({information_message: 'Se ha revocado el acceso exitosamente.'});
                        });
                    });
                }else{
                    res.status(403).json({information_message: 'No tienes permiso para realizar esta acci??n.'});
                }
            });
        }
    });
};

const update_email = (req, res) => {
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session=>{
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente'});
        }else{
            Email.findOne({where: {username: session.username}}).then(email => {
                email.update({email: req.body.email}).then(()=>{
                    res.status(200).json({information_message: 'Se la direcci??n de correo electronico con ??xito'});
                });
            });
        }
    });
};

const update_password_reminder_verification = ()=>{
    Bank_User.findAll().then(users=>{
        users.forEach(user=>{
            if(is_six_months_earlier(user.last_update_date)){
                Email.findOne({where: {username: user.username}}).then(email=>{
                    send_password_reminder_email(email);
                    user.update({last_update_date: new Date(Date.now())});
                });
            }
        });
    });
};

const get_denied_users = (req, res) => {
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session =>{
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente.'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user=>{
                if(has_admin_access(bank_user.user_type)){
                    Bank_User.findAll({where: {access: false}, raw: true}).then(users=>{
                        let result = [];
                        users.forEach(user=>{
                            result.push({
                                username: user.username,
                                user_type: user.user_type,
                                user_type_description: print_user_type(user.user_type),
                                cui: user.cui,
                                access: user.access,
                                last_update_date: user.last_update_date
                            })
                        });
                        res.status(200).json(result);
                    });
                }else{
                    res.status(403).json({information_message: 'No posee permisos para realizar esta acci??n.'});
                }
            });
        }
    })
};

module.exports = {
    create_user,
    update_user_password,
    password_recovery,
    revoke_access,
    get_all_users,
    get_bank_users,
    update_email,
    update_password_reminder_verification,
    get_denied_users
};