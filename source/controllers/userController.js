const { existAccount } = require("../models/account");
const user_db = require("../models/user");
const bcrypt = require("bcrypt");
var BCRYPT_SALT_ROUNDS = 3;

/**
 * @description Method that receives all the user information for create a new one
 * @param req.body.username Username for the new user
 * @param req.body.password Password for the new user
 * @param req.body.user_type Type for the new user
 * @param req.body.cui Cui from the new user
 */
const createUser = async(req, res) => {
    const user_type = req.body.user_type;
    if((await user_db.getUserByUsername(req.body.username)) == undefined){
        if(user_type == 1){ //si se crea un usuario cliente
            if(await existAccount(req.body.cui)){
                const hashed_password = await bcrypt.hash(password,BCRYPT_SALT_ROUNDS);
                user_db.saveUser(req.body.username,hashed_password,user_type,req.body.cui);
                res.status(200).json({mensaje:"Se ha creado su usuario correctamente."});
            }else{
                res.status(400).json({error:"No existe una cuenta bancaria ligada a su persona."});
            }
        }else{ //Si se crea un usuario bancario
            //Verificar primero si se encuentra autenticado el usuario como administrador
            user_db.saveUser(req.body.username,req.body.password,user_type,req.body.cui);
            res.status(200).json({mensaje:"Se ha creado el usuario correctamente"});
        }
    }else{
        res.status(400).json({error:"Ya existe un usuario con ese nombre."});
    }
};

/**
 * @description Method that receives a new password and an old one, so one user can update her password.
 * @param req.body.token Authentication token
 * @param req.body.old_password Password for verify the identity of the user
 * @param req.body.new_password New password to save in the database
 */
const updateUserPassword = (req, res) => {
    const authentication_token = await getActiveSessionByToken(req.body.token); //Verificamos sesion
    if(authentication_token != undefined){ 
        const user = await user_db.getUserByUsername(authentication_token.username);
        if(await bcrypt.compare(req.body.old_password, user.password)){
            if(req.body.new_password === req.body.old_password){
                res.status(403).json({error:"La nueva contraseña es igual a la anterior, no se realizaron modificacioens."});
            }else{
                const hashed_password = await bcrypt.hash(req.body.new_password, BCRYPT_SALT_ROUNDS);
                user_db.saveNewPassword(user.username, hashed_password);
                res.status(200).json({mensaje:"Se ha actualizado la contraseña correctamente."});
            }
        }else{
            res.status(403).json({error:"La contraseña ingresada no es correcta."});
        }
    }else{
        res.status(403).json({error:"El token que posee ha expirado, inicie sesion nuevamente."});
    }
};

module.exports = {
    createUser,
    updateUserPassword
};