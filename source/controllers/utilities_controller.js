const MS_FOR_SIX_MONTHS = 15778800000;
const MS_FOR_ONE_YEAR =   31557600000;
const CARD_OFFSET = BigInt(1000000000000000000);

function plus_card_offset(value){
    return BigInt(value)+CARD_OFFSET;
}

function is_six_months_earlier(date){
    return ((Date.now() - date.getTime()) >= MS_FOR_SIX_MONTHS)? true : false;
};

function is_six_months_later(date){
    return ((date.getTime() - Date.now()) >= MS_FOR_SIX_MONTHS)? true : false;
}

function get_credit_score(cui){
    return new Promise((resolve, reject) =>{
        var credit_score = 0;
        resolve(credit_score);
    });
};

function get_random_int(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

function print_request_type(type){
    switch(type){
        case 1: return 'Actualizacion de datos'
        case 2: return 'Cancelacion de tarjeta'
        case 3: return 'Tarjeta de credito'
        case 4: return 'Tarjeta de debito'
        case 5: return 'Prestamo'
        case 6: return 'Cuenta'
    }
};

function print_user_type(type){
    switch(type){
        case 1: return 'Cliente'
        case 2: return 'Cajero'
        case 3: return 'Burocratico'
        case 4: return 'Administrador'
    }
}

function has_bureaucratic_or_admin_access(user_type){
    return (user_type > 2) ? true : false;
}

function has_admin_access(user_type){
    return user_type == 4;
}

function has_cashier_access(user_type){
    return user_type > 1;
}

function has_client_access(user_type){
    return user_type == 1;
}

function is_owner(person_cui, owner_cui){
    return person_cui == owner_cui;
}

function plus_one_month(date){
    if(date.getMonth()==11){
        date.setFullYear(date.getFullYear()+1);
        date.setMonth(0);
    }else{
        date.setMonth(date.getMonth()+1);
    }
    return new Date(date);
}

module.exports = {
    MS_FOR_ONE_YEAR,
    is_six_months_later,
    is_six_months_earlier,
    get_credit_score,
    get_random_int,
    print_request_type,
    plus_one_month,
    has_admin_access,
    has_bureaucratic_or_admin_access,
    is_owner,
    plus_card_offset,
    has_client_access,
    has_cashier_access,
    print_user_type
}