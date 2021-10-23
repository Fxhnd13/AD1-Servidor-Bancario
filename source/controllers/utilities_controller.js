const MS_FOR_SIX_MONTHS = 1555200000;
const MS_FOR_ONE_YEAR = 3153600000;

function is_six_months_later(date){
    return ((Date.now() - date.getTime()) >= MS_FOR_SIX_MONTHS)? true : false;
};

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

function plus_one_month(date){
    if(date.getMonth()==11){
        date.setYear(date.getYear()+1);
        date.setMonth(0);
    }else{
        date.setMonth(date.getMonth()+1);
    }
    return date;
}

module.exports = {
    MS_FOR_ONE_YEAR,
    is_six_months_later,
    get_credit_score,
    get_random_int,
    print_request_type,
    plus_one_month
}