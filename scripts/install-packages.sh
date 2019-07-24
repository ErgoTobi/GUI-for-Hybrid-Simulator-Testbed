#!/bin/bash

#make sure you are in the vagrant environment and in the correct folder
#if [ $USER == "ubuntu" ] || [ $USER == "vagrant" ]; then
 #   cd /vagrant
#fi

#installing needed packages for npm
sudo apt-get install -qq npm

#install application needed packages
npm install

#install angular/cli package globally
sudo npm install -g @angular/cli

#install packages sequelize client for db creation, migration and seeding --> ORM
sudo npm install -g sequelize-cli


