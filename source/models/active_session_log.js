const access = require("../db/credentials");


/**
 * @description Get an active session information from the database
 * @param token Authentication token
 * @returns An Object with all the atributes from the table active_session_log
 */
const getActiveSessionByToken = async (token) => {
    const result = await access.session.query("SELECT * FROM active_session_log WHERE token=$1",[token]);
    return (result.rowCount > 0)? result.rows[0] : undefined;
};

/**
 * @description Get an active session information from the database
 * @param username The username for search an active session
 * @returns An object with all the atributes from the table active_session_log
 */
const getActiveSessionByUsername = async (username) => {
    const result = await access.session.query("SELECT * FROM active_session_log WHERE username=$1",[username]);
    return (result.rowCount > 0)? result.rows[0] : undefined;
};

/**
 * @description Save a new active session in the database
 * @param username 
 * @param token 
 */
const saveActiveSession = async (username, token) => {
    await access.session.query("INSERT INTO active_session_log (username,token) VALUES ($1,$2)",[username,token]);
};

/**
 * @description Delete an active session from the database using his token
 * @param token 
 */
const deleteActiveSession = async (token) => {
    await access.session.query("DELETE FROM active_session_log WHERE token=$1",[token]);
};

module.exports = {
    getActiveSessionByToken,
    getActiveSessionByUsername,
    saveActiveSession,
    deleteActiveSession
}