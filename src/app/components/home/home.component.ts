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

    constructor() {
    }

    ngOnInit() {
    }

    test() {/*
        const nodePath = (shell.which('node').toString());
        shell.config.execPath = nodePath;
        let command = shell.exec('/home/tobias/speed-dreams/build/games/speed-dreams-2 --text-only', {silent: false, async: true});
        command.stdout.on('data', (data) => {
        });*/
        const name = 'TobiJonasCarmen';
        let con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'password',
            database: 'applicationtestingsuite'
        });

        con.connect(function(err) {
            if (err) throw err;
            console.log('Connected!');
            let sql = "INSERT INTO applicationtestingsuite.suite (id, name, isReady, description, Setting_id) " +
                "VALUES (NULL, 'Microsoft AirSim', 0, 'nodejs', 1)";
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log('INSERTED!');
            });
            con.query('SELECT * FROM suite', function (err, result) {
                if (err) throw err;
                console.log('Result: ' + result[0].name);
            });
        });
    }
/*
    test1() {
        shell.cd('/home/tobias/operating-system/');
        let command2 = shell.exec('make vde', {silent: false, async: true});
        setTimeout(function () {
            let command5 = shell.pushd('hallo123');
        }, 5000,);
    }

    test2() {
        shell.cd('/home/tobias/operating-system/');
        //let command2 = shell.exec('make vde', {silent: false, async: true});
        let command3 = shell.exec('PROJECT=idp_acc make jenkins_run', {silent: false, async: true});
        command3.stdout.on('data', function (data) {
            if (data.includes('connected to mosquitto server')) {
                //if(flag === 0) {
                //flag = 1;
                let command4 = shell.exec('PROJECT=idp_savm make jenkins_run', {silent: false, async: true});
                command4.stdout.on('data', function (data) {
                    if (data.includes('Go')) {
                        let command6 = shell.exec('mosquitto_sub -t "#" -v', {silent: false, async: true});
                    }
                });
                // }
            }
        });
        //setTimeout(function(){
        //   let command4 = shell.exec('PROJECT=idp_savm make jenkins_run', {silent: false, async: true});
        //},35000);
    }*/
}
