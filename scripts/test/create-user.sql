-- Run With Root
CREATE DATABASE IF NOT EXISTS configuration_test;
 
USE configuration_test;

CREATE IF NOT EXISTS USER 'configuration'@'%' 
IDENTIFIED WITH mysql_native_password 
BY '88888888';

GRANT ALL PRIVILEGES 
ON configuration.* 
TO 'configuration'@'%';
