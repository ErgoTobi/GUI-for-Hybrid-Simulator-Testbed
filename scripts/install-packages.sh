#!/bin/bash

#installing needed packages for npm
sudo apt-get install -qq npm

#make sure you are in the vagrant environment and in the correct folder
if [$USER == "ubuntu" ] || [ $USER = "vagrant" ]; then
cd /vagrant
fi
#install application needed packages
npm install

#install angular/cli package globally
sudo npm install -g @angular/cli

