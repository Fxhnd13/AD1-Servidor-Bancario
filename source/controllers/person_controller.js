const { Active_Session_Log } = require('../models/active_session_log');
const { Bank_User } = require('../models/bank_user');
const { Person } = require('../models/person');
const { is_six_months_later, is_six_months_earlier, has_admin_access, is_owner, has_bureaucratic_or_admin_access } = require('../controllers/utilities_controller');

const create_person = (req, res) => {
    console.log(req.body.token);
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session=>{
        if(session == null){
            res.status(401).json({information_message:"El token de sesion ha expirado, inicie sesión nuevamente"});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(user => {
                if(has_admin_access(user.user_type)){
                    Person.create({
                        cui: req.body.cui,
                        name: req.body.name,
                        surname: req.body.surname,
                        address: req.body.address,
                        phone_number: req.body.phone_number,
                        birth_day: req.body.birth_day,
                        civil_status: req.body.civil_status,
                        gender: req.body.gender,
                        ocupation: req.body.ocupation,
                        last_update_date: new Date(Date.now())
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
    Active_Session_Log.findOne({where: {token: req.headers.token}, raw: true}).then(session=>{
        if(session == null){
            res.status(401).json({information_message:"El token de sesion ha expirado, inicie sesión nuevamente."});
        }else{
            Bank_User.findOne({where: {username: session.username}, raw: true}).then(user => {
                if(has_admin_access(user.user_type)){
                    if(req.body.id_request != undefined){
                        Request.findOne({where: {id_request: req.body.id_request}}).then(request=>{
                            request.update({verified: true});
                        });
                    }
                    Person.findOne({where: {cui: req.body.cui}}).then(person=>{
                        person.update({
                            address: req.body.address,
                            phone_number: req.body.phone_number,
                            civil_status: req.body.civil_status,
                            ocupation: req.body.ocupation,
                            last_update_date: new Date(Date.now())
                        });
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
                    if(is_owner(bank_user.cui, person.cui) || has_bureaucratic_or_admin_access(bank_user.user_type)){
                        res.status(200).json(person);
                    }else{
                        res.status(403).json({information_message: 'No posee acceso a esta información.'});
                    }
                })
            })
        }
    })
};

const update_data_reminder_verification = ()=>{
    Person.findAll().then(persons=>{
        persons.forEach(person=>{
            if(is_six_months_earlier(person.last_update_date)){
                Bank_User.findOne({where: {cui: person.cui}}).then(user=>{
                    Email.findOne({where: {username: user.username}}).then(email=>{
                        send_password_reminder_email(email);
                        person.update({last_update_date: new Date(Date.now())});
                    });
                });
            }
        });
    });
};

module.exports = {
    create_person,
    update_person,
    get_person_information,
    update_data_reminder_verification
}