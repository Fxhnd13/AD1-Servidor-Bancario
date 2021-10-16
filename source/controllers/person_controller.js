const { Active_Session_Log } = require('../models/active_session_log');
const { Bank_User } = require('../models/bank_user');
const { Person } = require('../models/person');

const create_person = (req, res) => {
    console.log(req.body.token);
    //Active_Session_Log.findOne({where: {token: req.body.token }}).then(session => {
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session=>{
        if(session == null){
            res.status(401).json({information_message:"El token de sesion ha expirado, inicie sesión nuevamente"});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(user => {
                if(user.user_type >= 3){
                    Person.create({
                        cui: req.body.cui,
                        name: req.body.name,
                        surname: req.body.surname,
                        address: req.body.address,
                        phone_number: req.body.phone_number,
                        birth_day: req.body.birth_day,
                        //civil_status: req.body.civil_status;
                        gender: req.body.gender,
                        ocupation: req.body.ocupation
                    });
                    res.status(200).json({information_message: "Se ha creado a la persona."});
                }else{
                    res.status(403).json({information_message:"No posee permisos para realizar esta accion."});
                }
            });
        }
    });
};

const update_person = (req, res) => {
    //Active_Session_Log.findOne({where: {token: req.body.token}}).then(session =>{
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session=>{
        if(session == null){
            res.status(401).json({information_message:"El token de sesion ha expirado, inicie sesión nuevamente."});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(user => {
                if(user.user_type >= 3){
                    Person.findOne({where: {cui: req.body.cui}}).then(person=>{
                        person.setAttributes({
                            address: req.body.address,
                            phone_number: req.body.phone_number,
                            //civil_status: req.body.civil_status,
                            ocupation: req.body.ocupation
                        });
                        person.save();
                    });
                    res.status(200).json({information_message: "Se han actualizado los datos."});
                }else{
                    res.status(403).json({information_message:"No posee permisos para realizar esta accion."});
                }
            });
        }
    });
};

const get_person_information = (req, res) => {
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session =>{
        if(session == null){
            res.status(401).json({information_message: 'Token de sesion ha expirado, inicie sesion nuevamente.'});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(bank_user=>{
                Person.findOne({where: {cui: bank_user.cui}, raw: true}).then(person=>{
                    res.status(200).json(person);
                })
            })
        }
    })
};

module.exports = {
    create_person,
    update_person,
    get_person_information
}