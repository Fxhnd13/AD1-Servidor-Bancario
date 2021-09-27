const access = require("../db/credentials");

const existAccount = async(cui) => {
    const result = await access.session.query("SELECT cui FROM account WHERE cui=$1", [cui]);
    return (result.rowCount > 0);
}

module.exports = {
    existAccount
}