import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {DataService} from '../../data.service';
import {Time} from '@angular/common';
import {Scenario} from '../../models/Scenario';

const eshell = require('electron').shell;
const shell = require('shelljs');
const Sequelize = require('sequelize');
const mqtt = require('mqtt');
// npmimport * as mqtt from 'mqtt';
// require('shelljs-plugin-open');
// let flag = 0;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
   // public data = 'test';
    @ViewChild('lastNameInput') nameInputRef: ElementRef;
    //activeChunk: Array;

    constructor(private dataService: DataService) {
    }

    ngOnInit() {
    }

    test() {
        const nodePath = (shell.which('node').toString());
        shell.config.execPath = nodePath;
        let command = shell.exec('/home/user1/speed-dreams/build/games/speed-dreams-2 -s quickrace', {silent: false, async: true});
        // command.stdout.on('data', (data) => {
        //  });

        shell.cd('/home/user1/operating-system/');
        let command2 = shell.exec('echo administrator | sudo -S make vde', {silent: false, async: true});
        //let command23 = shell.exec('make vde', {silent: false, async: true});

        let command3 = shell.exec('PROJECT=idp_acc make jenkins_run', {silent: false, async: true});
        command3.stdout.on('data', function (data) {
            if (data.includes('mosquitto server')) {
                //if(flag === 0) {
                //flag = 1;
                let command4 = shell.exec('PROJECT=idp_savm make jenkins_run', {silent: false, async: true});
                // command4.stdout.on('data', function (data1) {
                //     if (data1.includes('connected to mosquitto server')) {
                //     }
                // });
                //  setTimeout(function () {
                //    let command10 = shell.exec('pkill -P $$', {silent: false, async: true});
                // command.kill();
                //}, 19000);
            }
        });
    }

    test1() {
        shell.cd('/home/user1/operating-system/');
        let command2 = shell.exec('make vde', {silent: false, async: true});
        //let command2 = shell.exec('make vde < pass.txt', {silent: false, async: true});
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

    test3() {
        /*
        console.log(this.nameInputRef);
        // this.dataService.updateSuite('Tobi', 'Hi', true);
        console.log(this.dataService.createRunResultData());
        */
        this.dataService.authenticateDatabase();
        this.dataService.createDummyResultData();
        this.dataService.readAllTestsets().subscribe(
            data => { console.log('readAllTestsets: '); console.log(data);
            });
        this.dataService.readTestsetById(1).subscribe(
            data => { console.log('readTestsetById 1: '); console.log(data);
            });
        this.dataService.readSettingById(1).subscribe(
            data => { console.log('readSettingById 1: '); console.log(data);
            });
        /* Does not work
        this.dataService.readAllRunDetailsByRunId(2).subscribe(
            data => { console.log('readRunDetailById 2: '); console.log(data);
            });*/
        this.dataService.readAllRunsByResultId(1).subscribe(
            data => { console.log('readRunById 1: '); console.log(data);
            });
        this.dataService.readAllResultsOnly().subscribe(
            data => { console.log('readAllResultsOnly: '); console.log(data);
            });
    }

    test4() {
        this.dataService.deleteResultById(2);
        this.dataService.deleteTestsetById(1);
    }

    auth() {
        this.dataService.authenticateDatabase();
    }

    deleteAll() {
        this.dataService.clearAllTestsetsInDatabase().subscribe(data => {
            console.log('FlushDATABASE'); console.log(data);
        });
    }

    testBulk() {
        this.dataService.createSetting(9, true).subscribe(data => {
                console.log('createSetting'); console.log(data);
            }
        );
        this.dataService.createTestset('WSTestset');
        this.dataService.createTestset('WSTestset2').subscribe(data => {
                console.log('createTestset'); console.log(data);
            }
        );
        this.dataService.createScenario('WSScenario', 'ACC', 'Munich', 4, 2).subscribe(data => {
                console.log('createScenario'); console.log(data);
            }
        );
        this.dataService.createResult('WSTestsetResult', 987654, Sequelize.fn('NOW'), 2).subscribe(data => {
                console.log('createResult'); console.log(data);
            }
        );
        this.dataService.createRun(34565, Sequelize.fn('NOW'), 1, 3, 3).subscribe(data => {
                console.log('createRun'); console.log(data);
            }
        );
        this.dataService.createRunDetail (Sequelize.fn('NOW'), 'WSsavm/car/0/leadSpeed', '9.417906', 1).subscribe(data => {
                console.log('createRunDetail'); console.log(data);
            }
        );
        this.dataService.createRunDetail (Sequelize.fn('NOW'), 'WSsavm/car/0/ownSpeed', '7.142469', 1);
        let runDetails: { relativeTime: Time, key: string, value: string, runId: number }[] = [
            { 'relativeTime': Sequelize.fn('NOW'), 'key': 'WSsavm/car/0/curGear', 'value': '1', 'runId': 1 },
            { 'relativeTime': Sequelize.fn('NOW'), 'key': 'WSsavm/car/0/steerLock', 'value': '0.785398', 'runId': 1 },
            { 'relativeTime': Sequelize.fn('NOW'), 'key': 'WSsavm/car/0/enginerpm', 'value': '206.593704', 'runId': 1 },
            { 'relativeTime': Sequelize.fn('NOW'), 'key': 'WSsavm/car/0/curGear', 'value': '1', 'runId': 1 },
            { 'relativeTime': Sequelize.fn('NOW'), 'key': 'WSsavm/car/0/steerLock', 'value': '0.785398', 'runId': 1 },
            { 'relativeTime': Sequelize.fn('NOW'), 'key': 'WSsavm/car/0/enginerpm', 'value': '206.593704', 'runId': 1 },
            { 'relativeTime': Sequelize.fn('NOW'), 'key': 'WSsavm/car/0/curGear', 'value': '1', 'runId': 1 },
            { 'relativeTime': Sequelize.fn('NOW'), 'key': 'WSsavm/car/0/steerLock', 'value': '0.785398', 'runId': 1 },
            { 'relativeTime': Sequelize.fn('NOW'), 'key': 'WSsavm/car/0/enginerpm', 'value': '206.593704', 'runId': 1 }
        ];
        this.dataService.createRunDetailBulk (runDetails).subscribe(data => {
                console.log('createRunDetailBulk'); console.log(data);
            }
        );
        this.dataService.createRunDetail (Sequelize.fn('NOW'), 'WSsavm/car/0/ownSpeed', '7.142469', 1);
        this.dataService.createTestset('WSTestsetSingle').subscribe(data => {
            console.log('createTestsetBulk: '); console.log(data);
        });
        let scenarios2: Scenario[] = [
            { 'name': 'WSBulkScenario1', 'mode': 'ACC', 'route': 'Speedways', 'faultInjectionTime': 45, 'runQuantity': 10,
                'fileName': 'config', 'filePath': '/../config.json', 'testsetId': 0},
            { 'name': 'WSBulkScenario2', 'mode': 'ACC', 'route': 'Speedways', 'faultInjectionTime': 45, 'runQuantity': 10,
                'fileName': 'config', 'filePath': '/../config.json', 'testsetId': 0},
            { 'name': 'WSBulkScenario3', 'mode': 'ACC', 'route': 'Speedways', 'faultInjectionTime': 45, 'runQuantity': 10,
                'fileName': 'config', 'filePath': '/../config.json', 'testsetId': 0},
            { 'name': 'WSBulkScenario4', 'mode': 'ACC', 'route': 'Speedways', 'faultInjectionTime': 45, 'runQuantity': 10,
                'fileName': 'config', 'filePath': '/../config.json', 'testsetId': 0}
        ];
        this.dataService.createScenarioBulk('hellk', scenarios2).subscribe(data => {
                console.log('createTestsetScenariosBulk'); console.log(data);
            }
        );
    }

    test5() {
        const service = this.dataService;
        const values = [];
        localStorage.setItem('values', JSON.stringify(values));
        const client = mqtt.connect([{host: 'localhost', port: 1883}]);
        client.on('connect', function () {
            client.subscribe('#', function (err) {
                if (err) {
                  //  client.publish('savm/car/0/isPositionTracked', 'Error: Missing Data');
                }
            });
        });
        client.on('message', function (topic, message) {
            console.log(message.toString());
            const storedNames = JSON.parse(localStorage.getItem('values'));
            storedNames.push({relativeTime: 13, key: topic, value: message.toString(), runResultId: 1});
            localStorage.setItem('values', JSON.stringify(storedNames));
            if (storedNames.length === 200) {
                const temp = [storedNames[0], storedNames[1]];
                service.createRunDetailBulk(temp);
                storedNames.length = 0;
                localStorage.setItem('values', JSON.stringify(storedNames));
            }
        });
    }

    test6(){
        let command = shell.exec('/home/user1/speed-dreams/build/games/speed-dreams-2 -s quickrace', {silent: false, async: true});
    }

   /* convertValues(messagePair) {
        if (messagePair[0] === 'savm/car/0/isSpeedTracked' || messagePair[0] === 'savm/car/0/isPositionTracked') {
            return this.booleanize(messagePair[1]);
        }
        if (topic === 'savm/car/0/isSpeedTracked' || topic === 'savm/car/0/isSpeedTracked' || topic === 'savm/car/0/isSpeedTracked'
            || topic === 'savm/car/0/isSpeedTracked' || topic === 'savm/car/0/isSpeedTracked' ||) {

        }
    }

    booleanize(message) {
        return message === 1;
    }

    splitCoordinates(coordinates) {
        return coordinates.split(', ');
    }*/
}
