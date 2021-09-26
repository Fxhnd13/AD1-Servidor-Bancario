CREATE TABLE user (
    username TEXT PRIMARY KEY,
	password TEXT NOT NULL, 
	user_type INT NOT NULL FOREIGN KEY REFERENCES user_type(id_user_type),
	cui BIGINT NOT NULL FOREIGN KEY REFERENCES person(cui)
);

CREATE TABLE user_type (
    id_user_type SERIAL PRIMARY KEY,
    description TEXT NOT NULL
);

CREATE TABLE bank_user_status_log (
    id_bank_user_status_log SERIAL PRIMARY KEY,
    access BOOLEAN NOT NULL,
    username TEXT NOT NULL FOREIGN KEY REFERENCES user(username)
);

CREATE TABLE logged_user_log (
    id_logged_user_log SERIAL PRIMARY KEY,
    token TEXT NOT NULL
);

CREATE TABLE person (
	cui BIGINT PRIMARY KEY,
	name TEXT NOT NULL,
	surname TEXT NOT NULL,
	address TEXT,
	phone_number BIGINT,
	birth_day DATE,
	gender TEXT
);

CREATE TABLE email (
	cui INT NOT NULL FOREIGN KEY REFERENCES person(cui),
	email TEXT NOT NULL
);

CREATE TABLE account (
	id_account SERIAL PRIMARY KEY,
	cui INT NOT NULL FOREIGN KEY REFERENCES person(cui),
    id_account_type INT NOT NULL FOREIGN KEY REFERENCES account_type(id_account_type),
    balance DECIMAL
);

CREATE TABLE account_type (
	id_account_type SERIAL PRIMARY KEY,
	description TEXT NOT NULL,
	interés DECIMAL
);