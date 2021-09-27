const userDb = require("../models/user");
const { existAccount } = require("../models/account");

const createUser = async(req, res) => {
    const userType = req.body.userType;
    if((await userDb.getUserByUsername(req.body.username)) == undefined){
        if(userType == 1){ //si se crea un usuario cliente
            if(await existAccount(req.body.cui)){
                userDb.saveUser(req.body.username,req.body.password,userType,req.body.cui);
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

const updateUser = (req, res) => {
    res.send("Se ha actualizado a un usuario.");
};

module.exports = {
    createUser,
    updateUser
};