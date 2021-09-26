CREATE TABLE bank_user (
    username TEXT PRIMARY KEY,
	password TEXT NOT NULL, 
	user_type INT NOT NULL,  
	cui BIGINT NOT NULL
);

ALTER TABLE bank_user ADD CONSTRAINT FK_user_user_type FOREIGN KEY (user_type) REFERENCES user_type(id_user_type);
ALTER TABLE bank_user ADD CONSTRAINT FK_user_person FOREIGN KEY (cui) REFERENCES person(cui);

CREATE TABLE user_type (
    id_user_type SERIAL PRIMARY KEY,
    description TEXT NOT NULL
);

CREATE TABLE bank_user_status_log (
    id_bank_user_status_log SERIAL PRIMARY KEY,
    access BOOLEAN NOT NULL,
    username TEXT NOT NULL
);

ALTER TABLE bank_user_status_log ADD CONSTRAINT FK_bank_user_status_log_bank_user FOREIGN KEY (username) REFERENCES bank_user(username);

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
	username TEXT NOT NULL,
	email TEXT NOT NULL
);

ALTER TABLE email ADD CONSTRAINT FK_email_bank_user FOREIGN KEY (username) REFERENCES bank_user(username);

CREATE TABLE account (
	id_account SERIAL PRIMARY KEY,
	cui INT NOT NULL,
    id_account_type INT NOT NULL,
    balance DECIMAL
);

ALTER TABLE account ADD CONSTRAINT FK_account_account_type FOREIGN KEY (id_account_type) REFERENCES account_type(id_account_type);
ALTER TABLE account ADD CONSTRAINT FK_account_person FOREIGN KEY (cui) REFERENCES person(cui);

CREATE TABLE account_type (
	id_account_type SERIAL PRIMARY KEY,
	description TEXT NOT NULL,
	interés DECIMAL
);