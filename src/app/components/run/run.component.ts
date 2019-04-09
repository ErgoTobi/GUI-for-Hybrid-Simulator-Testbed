import {AfterViewInit, Component, OnInit, NgZone, ViewChild, ElementRef} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DataService} from '../../data.service';
import {MatTableDataSource} from '@angular/material';
import {RunDetail} from '../../models/RunDetail';
import {ActivatedRoute, Router} from '@angular/router';
import {isSuccess} from '@angular/http/src/http_utils';

import * as $ from 'jquery';
import * as moment from 'moment';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_dark from '@amcharts/amcharts4/themes/dark';

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_dark);
// Themes end


const mqtt = require('mqtt');
const shell = require('shelljs');
declare const Stopwatch: any;

@Component({
    selector: 'app-run',
    templateUrl: './run.component.html',
    styleUrls: ['./run.component.scss']
})
export class RunComponent implements OnInit, AfterViewInit {

    constructor(private dataService: DataService, private ngZone: NgZone, private route: ActivatedRoute, private router: Router) {
        // this.route.params.subscribe( params => {
        //     this.clickedTestsetId = params.id;
        //     }
        // );
    }

    @ViewChild('tab') tab;
    displayedColumns = ['status', 'runId', 'time', 'description'];
    displayedColumns2 = ['time', 'key', 'value'];
    dataSource = [];
    dataSource1 = [];
    tabs = [];
    headerTitle;
    selected = new FormControl(0);
    stopwatch;
    doneFlag;
    runningTestset; // wird über den onclick befüllt.
    runningTestsetResult;
    runningScenarios;
    activeRun;
    activeScenarioCounter;
    clickedTestsetId;
    activeSpeedDreams;

    chart;
    valuePassed = 0;
    valueFailed = 0;
    activeRunTimestamp;

    ngOnInit() {

        const m = moment();
        console.log(moment().diff(moment(), 'seconds'));
        // this.dataSource1[0] = FINISHED_RUNS;
        // this.dataSource1[0].push({status: 3, runId: 1, time: 'Currently Running..', description: ''});
        /* locationsSubscription = locations.subscribe({
             next(position) { console.log('Current Position: ' position); },
             error(msg) { console.log('Error Getting letLocation: ', msg); }
         });*/
        this.dataService.createResult('name', 23432, null, this.clickedTestsetId).subscribe(
            data => {
                const castedData = (data as any);
                this.runningTestsetResult = castedData.dataValues;
                console.log(data);
                this.doneFlag === 1 ? this.subscribeToMqtt() : this.doneFlag = 1;
                this.subscribe();
            }
        );
        this.dataService.readTestsetById(1).subscribe(
            data => {
                const tabs = this.tabs;
                const castedData = (data as any);
                castedData.scenarios.forEach(function (element) {
                    tabs.push(element.name);
                });
                this.runningTestset = castedData.dataValues;
                this.runningScenarios = this.runningTestset.scenarios;
                this.activeScenarioCounter = 0;
                this.headerTitle = this.runningScenarios[this.activeScenarioCounter].name;
                for (let s = 0; s < this.runningScenarios.length; s++) {
                    this.dataSource[s] = new MatTableDataSource<RunDetail>();
                    this.dataSource1[s] = [];
                }
                this.doneFlag === 1 ? this.subscribeToMqtt() : this.doneFlag = 1;
            });
        // $('#mat-tab-label-0-3').keydown(this.addTab);
    }

    subscribe() {
       /* this.dataService.readAllRunsByResultId(this.runningTestsetResult.id).subscribe(
            data => {
                const castedData = (data as any);
                const refactoredData = [];
                for (let i = 0; i < castedData.length; i++) {
                    castedData[i] = castedData[i].dataValues;
                    if (castedData[i].scenarioId === this.activeScenarioCounter) {
                        refactoredData.push(castedData);
                    }
                }
               // this.scenarios.findIndex( scenario => scenario.id === castedData[i].scenarioId)
                this.dataSource1[this.activeScenarioCounter] = refactoredData;
                this.updateGauge(refactoredData);
                if (!this.isScenarioEnded()) {
                    this.dataSource1[this.activeScenarioCounter].push
                    ({state: 3, resultId: 1, startTimestamp: 'Currently Running..', id: null});
                }
            });*/
        /*this.dataService.readAllRunsByResultId(this.runningTestsetResult.id).subscribe(
            data => {
                const castedData = (data as any);
                for (let i = 0; i < castedData.length; i++) {
                    castedData[i] = castedData[i].dataValues;
                }
                this.dataSource1[this.activeScenarioCounter] = castedData;
                this.dataSource1[0].push({state: 3, resultId: 1, timeStamp: 'Currently Running..', id: null});
            });*/ // GET IN
        this.dataService.readLast100RunDetailsByRunResultId(this.runningTestsetResult.id).subscribe(
            data => {//
                this.dataSource[this.activeScenarioCounter].data = data as RunDetail[];
                //   document.getElementById('info-container').animate
                // ({scrollTop: document.getElementById('info-container')[0].scrollHeight}, 1000);
                const interval = setTimeout(function () {
                    document.getElementById('feed-container').scrollTop = document.getElementById('feed-container').scrollHeight;
                }, 2000);
            });
        this.startRun();
    }

    ngAfterViewInit() {
        //     this.dataService.readTestsetById(1).subscribe(
        //         data => {
        //              // const tabs =  this.tabs;
        //              //  data.forEach(function(element) {
        //              //      tabs.push(element.name);
        //              //  });
        //               this.runningScenarios = data;
        //               this.activeScenarioCounter = 0;
        //
        //         });
        this.stopwatch = new Stopwatch(
            document.querySelector('.stopwatch'));
        this.stopwatch.start();
        //this.loadGauge();
        /*$('scrolled').on('scroll', function(){
            this.scrolled = true;
        });*/
        // this.subscribeToMqtt();
    }

    loadGauge(index) {
    //    if (document.getElementById('gaugechart')) {
            // Create chart instance
        //check if am4chart is already created TODO

            this.chart = am4core.create('gaugechart' + index, am4charts.RadarChart);

// Add data
            this.chart.data = [{
                'category': 'Failed Runs',
                'value': this.valueFailed,
                'full': 100,
                'fillColors': '#E45150'
            }, {
                'category': 'Passed Runs',
                'value': this.valuePassed,
                'full': 100,
                'fillColors': '#52D64D'
            }];

// Make chart not full circle
            this.chart.startAngle = -90;
            this.chart.endAngle = 180;
            this.chart.innerRadius = am4core.percent(20);

// Set number format
            this.chart.numberFormatter.numberFormat = '#.#\'%\'';

// Create axes
            const categoryAxis = this.chart.yAxes.push(new am4charts.CategoryAxis() as any);
            categoryAxis.dataFields.category = 'category';
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.grid.template.strokeOpacity = 0;
            categoryAxis.renderer.labels.template.horizontalCenter = 'right';
            categoryAxis.renderer.labels.template.fontWeight = 500;
            categoryAxis.renderer.labels.template.adapter.add('fill', function (fill, target) {
                return (target.dataItem.index >= 0) ? am4core.color(target.dataItem._dataContext.fillColors) : fill;
            });
            categoryAxis.renderer.minGridDistance = 10;

            const valueAxis = this.chart.xAxes.push(new am4charts.ValueAxis() as any);
            valueAxis.renderer.grid.template.strokeOpacity = 0;
            valueAxis.min = 0;
            valueAxis.max = 100;
            valueAxis.strictMinMax = true;

// Create series
            const series1 = this.chart.series.push(new am4charts.RadarColumnSeries() as any);
            series1.dataFields.valueX = 'full';
            series1.dataFields.categoryY = 'category';
            series1.clustered = false;
            series1.columns.template.fill = new am4core.InterfaceColorSet().getFor('alternativeBackground');
            series1.columns.template.fillOpacity = 0.08;
            series1.columns.template.cornerRadiusTopLeft = 20;
            series1.columns.template.strokeWidth = 0;
            series1.columns.template.radarColumn.cornerRadius = 20;

            const series2 = this.chart.series.push(new am4charts.RadarColumnSeries());
            series2.dataFields.valueX = 'value';
            series2.dataFields.categoryY = 'category';
            series2.clustered = false;
            series2.columns.template.strokeWidth = 0;
            series2.columns.template.tooltipText = '{category}: [bold]{value}[/]';
            series2.columns.template.radarColumn.cornerRadius = 20;
            series2.columns.template.adapter.add('fill', function (fill, target) {
                // /return chart.colors.getIndex(target.dataItem.index);
                return (target.dataItem.index >= 0) ? am4core.color(target.dataItem._dataContext.fillColors) : fill;
            });

// Add cursor
            this.chart.cursor = new am4charts.RadarCursor();
            const tooltip = $('g [aria-labelledby =\'id-67-title\']') as any;
            if (tooltip.length > 0) {
                tooltip[0].style.visibility = 'hidden';
            }

      //  } else {
        //    setTimeout(() => this.loadGauge(), 500);
     //   }
    }

   /* subscribeToMqtt() {
        const component = this;
        const service = this.dataService;
        const values = [];
        localStorage.setItem('values', JSON.stringify(values));
        // const convert = this.convertValues;

        const client = mqtt.connect([{host: 'localhost', port: 1883}]);
        client.on('connect', function () {
            client.subscribe('#', function (err) {
                if (err) {//
                    //  client.publish('savm/car/0/isPositionTracked', 'Error: Missing Data');
                }
            });
        });
        client.on('message', function (topic, message) {
            if (!component.activeRunTimestamp) {
            component.activeRunTimestamp = moment().format();
            }

            // console.log(message.toString());
            const storedNames = JSON.parse(localStorage.getItem('values'));
            storedNames.push({relativeTime: undefined, key: topic, value: message.toString(), runId: component.runningTestsetResult.id}); // NEED RELATIVE TIME
            localStorage.setItem('values', JSON.stringify(storedNames));

            if (storedNames.length === 200) {
                const temp = [storedNames[0], storedNames[1]];
                service.createRunDetailBulk(temp);
                storedNames.length = 0;
                localStorage.setItem('values', JSON.stringify(storedNames));
            }
            if (Math.floor(moment.duration(moment().diff(component.activeRunTimestamp)).asSeconds())
                === 17) {
// kill retstart QEMU ECU ACC ONLY//component.runningScenarios[component.activeScenarioCounter].injectionTime

            }
            console.log(moment.duration(moment().diff(component.activeRunTimestamp)).asSeconds());
            if (moment.duration(moment().diff(component.activeRunTimestamp)).asSeconds() >= 23) {
                service.createRunDetailBulk(storedNames);
                storedNames.length = 0;
                localStorage.setItem('values', JSON.stringify(storedNames));
                service.createRun(98970, undefined, component.isTestPassed(),
                    component.runningScenarios[component.activeScenarioCounter].id, component.runningTestsetResult.id).subscribe(
                        createData => {
                            component.dataService.readAllRunsByResultId(component.runningTestsetResult.id).subscribe(
                                data => {
                                    const castedData = (data as any);
                                    const refactoredData = [];
                                    for (let i = 0; i < castedData.length; i++) {
                                        castedData[i] = castedData[i].dataValues;
                                        if (castedData[i].scenarioId === component.activeScenarioCounter + 1) {
                                            refactoredData.push(castedData[i]);
                                        }
                                    }
                                    component.dataSource1[component.activeScenarioCounter] = refactoredData;
                                    component.updateGauge(refactoredData);
                                    if (component.dataSource1[component.activeScenarioCounter].length
                                        !== component.runningScenarios[component.activeScenarioCounter].dataValues.runQuantity) {
                                        component.dataSource1[component.activeScenarioCounter].push
                                        ({state: 3, resultId: 1, timeStamp: 'Currently Running..', id: null});
                                    }
                                });
                        }
                );// time +statew noch
                component.activeRunTimestamp = undefined;
              //  component.dataService.readAllRunsByResultId(component.runningTestsetResult.id).subscribe(
                    data => {
                        const castedData = (data as any);
                        const refactoredData = [];
                        for (let i = 0; i < castedData.length; i++) {
                            castedData[i] = castedData[i].dataValues;
                            if (castedData[i].scenarioId === component.activeScenarioCounter + 1) {
                                refactoredData.push(castedData);
                            }
                        }
                        component.dataSource1[component.activeScenarioCounter] = refactoredData;
                        component.updateGauge(refactoredData);
                        if (!component.isScenarioEnded()) {
                            component.dataSource1[component.activeScenarioCounter].push
                            ({state: 3, resultId: 1, startTimestamp: 'Currently Running..', id: null});
                        }
                    }); //ENDE HIER

                if (component.isTestsetEnded()) {
                    // stop fatal
                    component.killRun();
                    component.router.navigate([`../result/${component.runningTestsetResult.id}`], {relativeTo: component.route});
                    // route to result screen
                } else if (component.isScenarioEnded()) {
                    // switch to new Scenario
                    component.dataService.readAllRunsByResultId(component.runningTestsetResult.id).subscribe(
                        data => {
                            const castedData = (data as any);
                            const refactoredData = [];
                            for (let i = 0; i < castedData.length; i++) {
                                castedData[i] = castedData[i].dataValues;
                                if (castedData[i].scenarioId === component.activeScenarioCounter + 1) {
                                    refactoredData.push(castedData);
                                }
                            }
                            component.headerTitle = component.runningScenarios[component.activeScenarioCounter].name;
                            component.dataSource1[component.activeScenarioCounter] = refactoredData;
                        });
                    component.dataSource[component.activeScenarioCounter].length = 0;
                    component.activeScenarioCounter++;
                    component.tab.selectedIndex = component.activeScenarioCounter;
                    component.killRun();
                    setTimeout(() => {
                        component.startTestenvironment();
                    }, 2000);
                }
            }
        });
    } */
    subscribeToMqtt() {
        const component = this;
        const service = this.dataService;
        const values = [];
        localStorage.setItem('values', JSON.stringify(values));
        // const convert = this.convertValues;

        const client = mqtt.connect([{host: 'localhost', port: 1883}]);
        client.on('connect', function () {
            client.subscribe('#', function (err) {
                if (err) {//
                    //  client.publish('savm/car/0/isPositionTracked', 'Error: Missing Data');
                }
            });
        });
        client.on('message', function (topic, message) {
            if (!component.activeRunTimestamp) {
                component.activeRunTimestamp = moment().format();
                setTimeout(() => component.checkState(), 10000);
            }
            // console.log(message.toString());
            const storedNames = JSON.parse(localStorage.getItem('values'));
            storedNames.push({relativeTime: undefined, key: topic, value: message.toString(), runId: component.runningTestsetResult.id});
            localStorage.setItem('values', JSON.stringify(storedNames));
            if (storedNames.length === 200) {
                const temp = [storedNames[0], storedNames[1]];
                service.createRunDetailBulk(temp);
                storedNames.length = 0;
                localStorage.setItem('values', JSON.stringify(storedNames));
            }
        });
    }

    checkState() {
        const component = this;
        this.dataService.readAllRunsByResultId(1).subscribe(
            data => {
                this.killRun();
                if (component.isTestsetEnded()) {
                    // stop fatal
                    component.router.navigate([`../result/${component.runningTestsetResult.id}`], {relativeTo: component.route});
                    // route to result screen
                } else if (component.isScenarioEnded()) {
                    // switch to new Scenario
                    component.dataSource[component.activeScenarioCounter].length = 0;
                    component.activeScenarioCounter++;
                    component.tab.selectedIndex = component.activeScenarioCounter;
                    setTimeout(() => {
                        component.startRun();
                    }, 2000);
                } else {
                    component.startRun();
                }
            }
        );
    }
    startRun() {
        const component = this;
        const service = this.dataService;
        // service.createRunDetailBulk(storedNames);
        // storedNames.length = 0;
        // localStorage.setItem('values', JSON.stringify(storedNames));
        service.createRun(98970, undefined, 0,
            component.runningScenarios[component.activeScenarioCounter].id, component.runningTestsetResult.id).subscribe(
        runData => {
            component.activeRunTimestamp = undefined;
            const castedData = (runData as any);
            component.activeRun = castedData.dataValues;
            component.startTestenvironment();
            component.dataService.readAllRunsByResultId(component.runningTestsetResult.id).subscribe(
                data => {
                    const castedData = (data as any);
                    const refactoredData = [];
                    for (let s = 0; s < component.runningScenarios.length; s++) {
                        refactoredData[s] = [];
                    }
                    for (let i = 0; i < castedData.length; i++) {
                        castedData[i] = castedData[i].dataValues;
                        const index = component.runningScenarios.findIndex( scenario => scenario.id === castedData[i].scenarioId);
                        refactoredData[index].push(castedData[i]);
                    }
                    component.headerTitle = component.runningScenarios[component.activeScenarioCounter].name;
                    for (let s = 0; s < component.runningScenarios.length; s++) {
                        component.dataSource1[s] = refactoredData[s];
                    }
                    component.headerTitle = component.runningScenarios[component.activeScenarioCounter].name;
                   // component.updateGauge(refactoredData);
                });
        });
    }

    startTestenvironment() {
        const component = this;
        const nodePath = (shell.which('node').toString());
        shell.config.execPath = nodePath;
        const command = shell.exec('/home/user1/speed-dreams/build/games/speed-dreams-2 -s quickrace', {silent: false, async: true});
        // command.stdout.on('data', (data) => {
        //  });
        component.activeSpeedDreams = command;
        shell.cd('/home/user1/operating-system/');
        const command2 = shell.exec('echo administrator | sudo -S make vde', {silent: false, async: true});
        // let command23 = shell.exec('make vde', {silent: false, async: true});

        const command3 = shell.exec('PROJECT=idp_acc make jenkins_run', {silent: false, async: true});
        command3.stdout.on('data', function (data) {
            if (data.includes('mosquitto server')) {
                // if(flag === 0) {
                // flag = 1;
                const command4 = shell.exec('PROJECT=idp_savm make jenkins_run', {silent: false, async: true});
                // command4.stdout.on('data', function (data1) {
                //     if (data1.includes('connected to mosquitto server')) {
                //         component.stopwatch.start();
                //     }
                // });
            }
        });
    }
    onActiveTabChange(event) {
            console.log('test');
            this.loadGauge(event.index);
    }
    updateGauge(data) {
        let passedScenarios = 0;
        let failedScenarios = 0;
        data.forEach(element => {
            if (element.state === 0) {
                passedScenarios++;
            }
            if (element.state === 1) {
                failedScenarios++;
            }
        });
        this.chart.data[0]['value'] = failedScenarios / this.runningScenarios[this.activeScenarioCounter].dataValues.runQuantity * 100;
        this.chart.data[1]['value'] = passedScenarios / this.runningScenarios[this.activeScenarioCounter].dataValues.runQuantity * 100;
        this.chart.invalidateData();
    }

    isTestPassed() {
        return 0;
    }

    stopTest() {
        this.chart.data[0]['value'] = 50;
        this.chart.data[1]['value'] = 80;
        this.chart.invalidateData();
    }

    killRun() {
        const command = shell.exec('killall -9 qemu-system-arm', {silent: false, async: true});
        command.stdout.on('data', function (data) {
            console.log(data);
        });
        const command2 = shell.exec('killall -9 speed-dreams-2', {silent: false, async: true});
        command2.stdout.on('data', function (data1) {
            console.log(data1);
        });
    }

    isScenarioEnded() {
        return this.runningScenarios[this.activeScenarioCounter].dataValues.runQuantity
            === this.dataSource1[this.activeScenarioCounter].length;
    }

    isTestsetEnded() {
        return this.isScenarioEnded() && this.activeScenarioCounter === this.runningScenarios.length - 1;
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