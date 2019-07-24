#!/bin/bash

sudo apt-get install -qq mysql-server
sudo mysql -e "use mysql; update user set authentication_string=password(''),plugin='mysql_native_password' where user='root';flush privileges;"
#TODO: Check this part if it can be run, sequelize was not found on first run.
sudo sed -i 's/127.0.0.1/0.0.0.0/g' /etc/mysql/mysql.conf.d/mysqld.cnf
#sudo sed -i 's/bind-address/#bind-address/g' /etc/mysql/my.cnf
sudo service mysql restart

# https://stackoverflow.com/questions/40034644/unable-to-connect-mysql-using-rootip-address-in-vagrant
# To Do new user https://stackoverflow.com/questions/1559955/host-xxx-xx-xxx-xxx-is-not-allowed-to-connect-to-this-mysql-server

# Use the following command to access; when asked for a password --> just press enter
# mysql -u newuser -h localhost -P 5656 --protocol=tcp -p

mysql --user="root" --password="" --execute="CREATE USER 'root'@'%' IDENTIFIED BY '';"
mysql --user="root" --password="" --execute="GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;"
#mysql --user="root" --password="" --execute="CREATE DATABASE sequelize_test;"
#nano ~/.ssh/known_hosts

#/vagrant/node_modules/.bin/sequelize db:create
#/vagrant/node_modules/.bin/sequelize db:migrate
#/vagrant/node_modules/.bin/sequelize db:seed:all

