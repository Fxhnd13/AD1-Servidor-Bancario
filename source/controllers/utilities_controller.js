const MS_FOR_SIX_MONTHS = 1555200000;

module.exports.log = function is_six_months_later(date){
    return ((Date.now() - date.getTime()) >= MS_FOR_SIX_MONTHS)? true : false;
};

module.exports.log = function get_credit_report(cui){

};