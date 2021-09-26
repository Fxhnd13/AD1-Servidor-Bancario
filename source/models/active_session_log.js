const access = require("../db/credentials");

const getActiveSessionByToken = async (token) => {
    const result = await access.session.query("SELECT * FROM active_session_log WHERE token=$1",[token]);
    return (result.rowCount > 0)? result.rows[0] : undefined;
};

const getActiveSessionByUsername = async (username) => {
    const result = await access.session.query("SELECT * FROM active_session_log WHERE username=$1",[username]);
    return (result.rowCount > 0)? result.rows[0] : undefined;
};

const saveActiveSession = async (username, token) => {
    await access.session.query("INSERT INTO active_session_log (username,token) VALUES ($1,$2)",[username,token]);
};

const deleteActiveSession = async (token) => {
    await access.session.query("DELETE FROM active_session_log WHERE token=$1",[token]);
};

module.exports = {
    getActiveSessionByToken,
    getActiveSessionByUsername,
    saveActiveSession,
    deleteActiveSession
}