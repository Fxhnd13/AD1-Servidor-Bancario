const MS_FOR_SIX_MONTHS = 1555200000;
const MS_FOR_ONE_YEAR = 3153600000;

function is_six_months_later(date){
    return ((Date.now() - date.getTime()) >= MS_FOR_SIX_MONTHS)? true : false;
};

function get_credit_report(cui){
    
};

function get_random_int(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

module.exports = {
    MS_FOR_ONE_YEAR,
    is_six_months_later,
    get_credit_report,
    get_random_int
}