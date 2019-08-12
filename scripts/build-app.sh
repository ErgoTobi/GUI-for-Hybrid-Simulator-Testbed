#!/bin/bash

cd /vagrant
# New dependecies added therefore rebuilds

npm rebuild node-sass

#sudo npm cache clean -f
#sudo npm install -g n
#sudo n stable
# Setup Binary Link – Now link your node binary with latest nodejs installed binary file using following command.
#sudo ln -sf /usr/local/n/versions/node/11.8.0/bin/node /usr/bin/node
#node -v

#building the app
#TODO: Finding the correct command
# App Image is build but where can it be run and can it be run seperately?

# Wahrscheinlich build error
npm run electron:linux

#sudo apt-get install wine-stable
#npm run electron:windows

#npm run electron:mac


#https://github.com/angular/angular-cli/issues/6848
#sudo npm install -g electron --unsafe-perm=true --allow-root