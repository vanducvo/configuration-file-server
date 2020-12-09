-- Run With Root
CREATE DATABASE IF NOT EXISTS configuration;

CREATE USER 'configuration'@'%' 
IDENTIFIED WITH mysql_native_password 
BY '88888888';

GRANT ALL PRIVILEGES 
ON configuration.* 
TO 'configuration'@'%';
