const access = require("../db/credentials");
const bcrypt = require("bcrypt");
var BCRYPT_SALT_ROUNDS = 3;

const getUserByUsername = async (username) => {
    const result = await access.session.query("SELECT * FROM bank_user WHERE username='"+username+"'");
    return (result.rowCount > 0)? result.rows[0] : undefined;
};

const saveUser = async(username, password, userType, cui) => {
    const hashedPassword = await bcrypt.hash(password,BCRYPT_SALT_ROUNDS);
    const result = await access.session.query("INSERT INTO bank_user VALUES ($1,$2,$3,$4)",[username,hashedPassword,userType,cui]);
};

const authenticateUser = async(passwordSent, hashPassword) => {
    if(await bcrypt.compare(passwordSent, hashPassword)){
        return true;
    }else{
        return false;
    }
};

module.exports = {
    getUserByUsername,
    saveUser,
    authenticateUser
}