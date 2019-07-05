#!/bin/bash

sudo apt-get install -qq mysql-server
sudo mysql -e "use mysql; update user set authenticationstring=password(''),plugin='mysql_native_password' where user='root';flush privileges;"
#TODO: Check this part if it can be run, sequelize was not found on first run.
sed -i 's/127.0.0.1/0.0.0/g' /etc/mysql/mysql.conf.d/mysqld.cnf
/vagrant/node_modules/.bin/sequelize db:create
/vagrant/node_modules/.bin/sequelize db:migrate
/vagrant/node_modules/.bin/sequelize db:seed:all

