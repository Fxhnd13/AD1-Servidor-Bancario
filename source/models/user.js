const access = require("../db/credentials");

/**
 * @description Get a user from the database using his username
 * @param username Username of the user to get from database
 * @returns An 'Object' with the table bank_user atributes or undefined if not exits
 */
const getUserByUsername = async (username) => {
    const result = await access.session.query("SELECT * FROM bank_user WHERE username='"+username+"'");
    return (result.rowCount > 0)? result.rows[0] : undefined;
};

/**
 * @description Save all the information for a new user in the database
 * @param username Username of the new user
 * @param hashed_password Encripted password of the new user
 * @param userType Type of the new user
 * @param cui Cui of the new user
 */
const saveUser = async(username, hashed_password, userType, cui) => {
    await access.session.query("INSERT INTO bank_user VALUES ($1,$2,$3,$4)",[username,hashed_password,userType,cui]);
};

/**
 * @description Save a new password for a user in the database
 * @param username Username of the user who wants to update his password
 * @param hashed_password Encripted password to update
 */
const saveNewPassword = async(username, hashed_password) => {
    await access.session.query("UPDATE bank_user SET password=$1 WHERE username=$2",[hashed_password,username]);
};

module.exports = {
    getUserByUsername,
    saveUser,
    saveNewPassword
}