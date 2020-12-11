DROP DATABASE IF EXISTS configuration;
CREATE DATABASE configuration;

DROP USER IF EXISTS configuration;
CREATE USER 'configuration'@'%' 
IDENTIFIED WITH mysql_native_password 
BY '88888888';

GRANT ALL PRIVILEGES 
ON configuration.* 
TO 'configuration'@'%';

USE configuration;

CREATE TABLE user
(
	id INT AUTO_INCREMENT PRIMARY KEY,
    username NVARCHAR(50) NOT NULL UNIQUE,
    password NVARCHAR(100) NOT NULL
);


CREATE TABLE configuration (
	id INT AUTO_INCREMENT PRIMARY KEY,
    data JSON,
    user_id INT NOT NULL,
    FOREIGN KEY 
		(user_id) 
    REFERENCES user(id) 
    ON UPDATE CASCADE 
    ON DELETE RESTRICT
);