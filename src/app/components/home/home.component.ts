import {Component, OnInit} from '@angular/core';

const eshell = require('electron').shell;
const shell = require('shelljs');
// npmimport * as mqtt from 'mqtt';
// require('shelljs-plugin-open');
// let flag = 0;
const mysql = require('mysql');

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
   // public data = 'test';
    constructor() {
    }

    ngOnInit() {
    }

    test() {
        const nodePath = (shell.which('node').toString());
        shell.config.execPath = nodePath;
        let command = shell.exec('/home/user1/speed-dreams/build/games/speed-dreams-2 -s quickrace', {silent: false, async: true});
        command.stdout.on('data', (data) => {
        });

        shell.cd('/home/user1/operating-system/');
        let command2 = shell.exec('make vde < pass.txt', {silent: false, async: true});

        let command3 = shell.exec('PROJECT=idp_acc make jenkins_run', {silent: false, async: true});
        command3.stdout.on('data', function (data) {
            if (data.includes('mosquitto server')) {
                //if(flag === 0) {
                //flag = 1;
                    let command4 = shell.exec('PROJECT=idp_savm make jenkins_run', {silent: false, async: true});
                    // command4.stdout.on('data', function (data1) {
                    //     if (data1.includes('connected to mosquitto server')) {
                    //         let command6 = shell.exec('mosquitto_sub -t "#" -v', {silent: false, async: true});
                    //         //data = data1;
                    //     }
                    // });
                setTimeout(function () {
                    let command10 = shell.exec('pkill -P $$', {silent: false, async: true});
                  command.kill();
                }, 19000);
            }
        });
    }

    test1() {
        shell.cd('/home/user1/operating-system/');
        let command2 = shell.exec('make vde < pass.txt', {silent: false, async: true});
       // let command8 = shell.exec('echo administrator', {silent: false, async: true});

       /* setTimeout(function () {
            let command5 = shell.pushd('hallo123');
        }, 5000,);*/
    }

    test2() {
        shell.cd('/home/user1/operating-system/');
        //let command2 = shell.exec('make vde', {silent: false, async: true});
        let command3 = shell.exec('PROJECT=idp_acc make jenkins_run', {silent: false, async: true});
        command3.stdout.on('data', function (data) {
            if (data.includes('mosquitto server')) {
                //if(flag === 0) {
                //flag = 1;
                setTimeout(function () {
                    let command4 = shell.exec('PROJECT=idp_savm make jenkins_run', {silent: false, async: true});
                    command4.stdout.on('data', function (data1) {
                        if (data1.includes('connected to mosquitto server')) {
                            let command6 = shell.exec('mosquitto_sub -t "#" -v', {silent: false, async: true});
                            //data = data1;
                        }
                    });
                }, 4000);
            }
        });
        //setTimeout(function(){
        //   let command4 = shell.exec('PROJECT=idp_savm make jenkins_run', {silent: false, async: true});
        //},35000);
    }
    testTobi() {/*
        const nodePath = (shell.which('node').toString());
        shell.config.execPath = nodePath;
        let command = shell.exec('/home/tobias/speed-dreams/build/games/speed-dreams-2 --text-only', {silent: false, async: true});
        command.stdout.on('data', (data) => {
        });*/
        const name = 'TobiJonasCarmen';
        let con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: null,
            database: "application_testing_suite"
        });

        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            con.query("SELECT * FROM suite", function (err, result) {
                if (err) throw err;
                console.log("Result: " + result[0].name);
            });
        });
    }
}
