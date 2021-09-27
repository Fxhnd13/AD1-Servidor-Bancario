const { existAccount } = require("../models/account");
const userDb = require("../models/user");
const bcrypt = require("bcrypt");
var BCRYPT_SALT_ROUNDS = 3;

const createUser = async(req, res) => {
    const userType = req.body.userType;
    if((await userDb.getUserByUsername(req.body.username)) == undefined){
        if(userType == 1){ //si se crea un usuario cliente
            if(await existAccount(req.body.cui)){
                const hashedPassword = await bcrypt.hash(password,BCRYPT_SALT_ROUNDS);
                userDb.saveUser(req.body.username,hashedPassword,userType,req.body.cui);
                res.status(200).json({mensaje:"Se ha creado su usuario correctamente.",error:""});
            }else{
                res.status(400).json({mensaje:"No se ha creado su usuario.",error:"No existe una cuenta bancaria ligada a su persona."});
            }
        }else{ //si se crea un usuario del banco
            userDb.saveUser(req.body.username,req.body.password,userType,req.body.cui);
            res.status(200).json({mensaje:"Se ha creado el usuario correctamente",error:""});
        }
    }else{
        res.status(400).json({mensaje:"No se ha creado su usuario.",error:"Ya existe un usuario con ese nombre."});
    }
};

const updateUserPassword = (req, res) => {
    //verificar autenticacion
    const authenticationToken = await getActiveSessionByToken(req.body.token);
    if(authenticationToken != undefined){
        //verificar que sea el usuario sea el con la contraseña antigua
        const user = await userDb.getUserByUsername(authenticationToken.username);
        if(await bcrypt.compare(req.body.oldPassword, user.password)){
            if(req.body.newPassword === req.body.oldPassword){
                res.status(403).json({mensaje:"",error:"La nueva contraseña es igual a la anterior, no se realizaron modificacioens."});
            }else{
                const hashedPassword = await bcrypt.hash(req.body.newPassword, BCRYPT_SALT_ROUNDS);
                userDb.saveNewPassword(user.username, hashedPassword);
            }
        }else{
            res.status(403).json({mensaje:"",error:"La contraseña ingresada no es correcta."});
        }
    }else{
        res.status(403).json({error:"El token que posee ha expirado, inicie sesion nuevamente."});
    }
    res.send("Se ha actualizado a un usuario.");
};

module.exports = {
    createUser,
    updateUserPassword
};