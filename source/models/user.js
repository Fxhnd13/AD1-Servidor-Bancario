const access = require("../db/credentials");

const getUserByUsername = async (username) => {
    const result = await access.session.query("SELECT * FROM bank_user WHERE username='"+username+"'");
    return (result.rowCount > 0)? result.rows[0] : undefined;
};

const saveUser = async(username, hashedPassword, userType, cui) => {
    await access.session.query("INSERT INTO bank_user VALUES ($1,$2,$3,$4)",[username,hashedPassword,userType,cui]);
};

const saveNewPassword = async(username, hashedPassword) => {
    await access.session.query("UPDATE bank_user SET password=$1 WHERE username=$2",[hashedPassword,username]);
};

module.exports = {
    getUserByUsername,
    saveUser,
    saveNewPassword
}