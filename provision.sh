X#!/bin/bash
#######################
#
# This is a provision script
# it will be called once when the vagrant vm is first provisioned
# If you have commands that you want to run always please have a
# look at the bootstrap.sh script
#
# Contributor: Jonas Bender
######################

if [ $USER == "ubuntu" ] || [ $USER == "vagrant" ]; then
  cd /vagrant
  # uncomment the following line if you want to 'visually' access the virtual machine
  #sudo apt-get install -qq alsa-base alsa-utils pulseaudio pulseaudio-utils ubuntu-desktop
  sudo apt update
  sudo apt-get install -qq make
  #make packages
fi

# initialize and update submodules
git submodule update --init

#install application
#sudo apt-get install -qq ng
sudo apt-get install -qq npm
npm install

#deploy app binary
sudo npm install -g @angular/cli
sudo npm install -g n
sudo n stable
npm run electron:linux

#install mysql
sudo apt-get install -qq mysql-server
sudo mysql -e "use mysql; update user set authentication_string=password(''),plugin='mysql_native_password' where user='root';flush privileges;"
sed -i 's/127.0.0.1/0.0.0.0/g' /etc/mysql/mysql.conf.d/mysqld.cnf
cd /vagrant/src/app
/vagrant/node_modules/.bin/sequelize db:create
/vagrant/node_modules/.bin/sequelize db:migrate
/vagrant/node_modules/.bin/sequelize db:seed:all