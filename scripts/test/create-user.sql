-- Run With Root
DROP DATABASE IF EXISTS configuration_test;
CREATE DATABASE configuration_test;
 

DROP USER IF EXISTS configuration_test;
CREATE USER 'configuration_test'@'%' IDENTIFIED WITH mysql_native_password BY '88888888';

GRANT ALL PRIVILEGES ON configuration_test.* TO 'configuration_test'@'%';
