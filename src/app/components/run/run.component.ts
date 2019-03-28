import {AfterViewInit, Component, OnInit, NgZone, ViewChild, ElementRef} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DataService} from '../../data.service';
import {MatTableDataSource} from '@angular/material';
import {RunDetail} from '../../models/RunDetail';
import { ActivatedRoute } from '@angular/router';
const mqtt = require('mqtt');
const shell = require('shelljs');
declare const Stopwatch: any;
@Component({
    selector: 'app-run',
    templateUrl: './run.component.html',
    styleUrls: ['./run.component.scss']
})
export class RunComponent implements OnInit, AfterViewInit {
    @ViewChild('tab') tab;
    displayedColumns = ['status', 'runId', 'time', 'description'];
    displayedColumns2 = ['time', 'key', 'value'];
    dataSource = new MatTableDataSource<RunDetail>();
    dataSource1 = [];
    tabs = [];
    selected = new FormControl(0);
    stopwatch;
    runningTestset; // wird über den onclick befüllt.
    runningTestsetResult;
    runningScenarios;
    activeScenarioCounter;
    clickedTestsetId;

    constructor(private dataService: DataService, private ngZone: NgZone, private route: ActivatedRoute) {
        this.route.params.subscribe( params => {
            this.clickedTestsetId = params.id;
            }
        );
    }

    ngOnInit() {
       // this.dataSource1[0] = FINISHED_RUNS;
        //this.dataSource1[0].push({status: 3, runId: 1, time: 'Currently Running..', description: ''});
       /* locationsSubscription = locations.subscribe({
            next(position) { console.log('Current Position: ' position); },
            error(msg) { console.log('Error Getting letLocation: ', msg); }
        });*/
      /* this.runningTestsetResult = this.dataService.createTestsetResult('name', new Date().getTime(), '00:00:00', this.clickedTestsetId);
        this.dataService.readTestsetById(this.clickedTestsetId).subscribe(
            data => {
                const tabs =  this.tabs;
                data.scenarios.forEach(function(element) {
                    tabs.push(element.name);
                });
                this.runningTestset = data;
                this.runningScenarios = data.scenarios;
                this.activeScenarioCounter = 0;
            });
*/
        this.dataService.readAllRunResultsByScenarioResultId(1).subscribe(
            data => {
                this.dataSource1[0] = data;
                this.dataSource1[0].push({status: 3, runId: 1, time: 'Currently Running..', description: ''});
            });
        this.dataService.readLast100RunDetailsByRunResultId(1).subscribe(
            data => {
                this.dataSource.data = data as RunDetail[];
             //   document.getElementById('info-container').animate
               // ({scrollTop: document.getElementById('info-container')[0].scrollHeight}, 1000);
               const interval = setInterval(function() {
                   document.getElementById('feed-container').scrollTop = document.getElementById('feed-container').scrollHeight;
                   }, 3000);
            });
        // $('#mat-tab-label-0-3').keydown(this.addTab);
    }
     ngAfterViewInit() {
         this.dataService.readAllScenarioResultsByTestsetResultId(1).subscribe(
             data => {
                  const tabs =  this.tabs;
                   data.forEach(function(element) {
                       tabs.push(element.name);
                   });
                   this.runningScenarios = data;
                   this.activeScenarioCounter = 0;

             });
         this.stopwatch = new Stopwatch(
             document.querySelector('.stopwatch'));
         /*$('scrolled').on('scroll', function(){
             this.scrolled = true;
         });*/
         // this.subscribeToMqtt();
         // this.restartTestenvironment();
     }
    subscribeToMqtt() {
        this.stopwatch.start();
        const service = this.dataService;
        const values = [];
        let runningScenarios = this.runningScenarios;
        let activeScenarioCounter = this.activeScenarioCounter;
        const killRun = this.killRun;
        const restartTestenvironment = this.restartTestenvironment;
        localStorage.setItem('values', JSON.stringify(values));
        //const convert = this.convertValues;

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

            //LikeABosch
            if (topic > '4Minutes') {
                service.createRunDetailBulk(storedNames);
                storedNames.length = 0;
                localStorage.setItem('values', JSON.stringify(storedNames));
                /*createRunResult (startTimestamp: Timestamp<any>, duration: Time, state: String, scenarioresultId: number) {
                    Runresult.create({
                        startTimestamp: startTimestamp, // To add to database
                        duration: duration,
                        state: state,
                        scenarioResultId: scenarioresultId
                    }).catch(error => {
                        console.error('createRunResult: ', error);
                    });*/
                //service.createRunResult(104214, topic, 0, 1);

                // setNewId()
                //killRun();
                restartTestenvironment();
            }
            // if(isScenarioEnd()){
            //     //switch to new Scenario
            //     this.tab.selectedIndex = 1;
            // }
            // if(isTestSetEnd()){
            // }

        });
    }


    /*navigateTo(item, event) {
      this.activeItem = item;
  naumber  }*/
    killRun() {
    }
    restartTestenvironment() {
        const logData = this.subscribeToMqtt;
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
    startTest() {
    }

}


/* LIST CODE */

export class Runs {
    status: number;
    runId: number;
    time: string;
    description: string;

    constructor(status, runId, time, description) {
       this.status = status;
       this.runId = runId;
       this.time = time;
       this.description = description;
    }

}

const FINISHED_RUNS: Runs[] = [
    {status: 0, runId: 1, time: '04:00:00', description: 'example text'},
    {status: 1, runId: 1, time: '04:00:00', description: 'example text'},
    {status: 0, runId: 1, time: '04:00:00', description: 'example text'}
];
