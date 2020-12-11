#!/bin/bash

if ! command -v mysql  &> /dev/null
then
  echo 'Must Have MYSQL client';
  exit;
fi

echo 'RUN WITH ROOT MYSQL';

echo 'create user';
mysql -uroot -e 'source ./scripts/test/create-user.sql';

echo 'create table user of configuration_test';
mysql -uroot configuration_test -e 'source ./scripts/test/create-table-user.sql'

echo 'create table configuration of configuration_test';
mysql -uroot configuration_test -e 'source ./scripts/test/create-table-configuration.sql'