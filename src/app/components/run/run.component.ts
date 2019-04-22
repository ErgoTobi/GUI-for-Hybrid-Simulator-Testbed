import {AfterViewInit, Component, OnInit, NgZone, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DataService} from '../../data.service';
import {InterComponentService} from '../../inter-component.service';
import {EncrDecrService} from '../../encr-decr.service';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {RunDetail} from '../../models/RunDetail';
import {ActivatedRoute, Router} from '@angular/router';
import { Subscription } from 'rxjs';
import {isSuccess} from '@angular/http/src/http_utils';
//
import * as $ from 'jquery';
import moment from 'moment';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_dark from '@amcharts/amcharts4/themes/dark';
import {PasswordDialogComponent} from '../overview-detail/password-dialog/password-dialog.component';
import {StopDialogComponent} from './stop-dialog/stop-dialog.component';
import {text} from '@angular/core/src/render3';

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
export class RunComponent implements OnInit, AfterViewInit, OnDestroy {

    constructor(private dataService: DataService, private ngZone: NgZone, private route: ActivatedRoute, private router: Router,
                private interComponentService: InterComponentService, private EncrDecr: EncrDecrService, public dialog: MatDialog) {
        // this.route.params.subscribe( params => {
        //     this.clickedTestsetId = params.id;
        //     }
        // );
        this.clickedTestsetId = this.interComponentService.getRunTestsetId();
        this.password = this.EncrDecr.get('123456$#@$^@1ERF', this.interComponentService.getAdminPassword());
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
    activeRunId;
    interval;
    activeScenarioCounter;
    clickedTestsetId;
    password;
    estimateFinish;
    activeSpeedDreams;
    activeECUs;
    activeSAVM;
    timeouts = [];
    testFailedFlag;
    testFailCounter = 0;
    storedNames = [];
    chart;
    chartValues = [];
    activeRunTimestamp;

    ngOnInit() {
        this.interComponentService.setButtonHeaderActive(false);
        this.dataService.readTestsetById(this.clickedTestsetId).subscribe(
            data => {
                const m = moment();
                let secondsForTest = 0;
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
                    secondsForTest += this.runningScenarios[s].dataValues.runQuantity * 240;
                    // this.chartValues[s] = {passed: 0, failed: 0};
                    // NOT SURE TEST IT this.dataSource1[s] = [];
                }
                this.estimateFinish = m.add(secondsForTest, 'seconds').format('llll');
                this.doneFlag === 1 ? this.subscribeToMqtt() : this.doneFlag = 1;
                this.dataService.createResult(this.runningTestset.name, undefined, this.clickedTestsetId).subscribe(
                    resultData => {
                        const castedData2 = (resultData as any);
                        this.runningTestsetResult = castedData2.dataValues;
                        this.doneFlag === 1 ? this.subscribeToMqtt() : this.doneFlag = 1;
                        this.subscribe();
                    }
                );
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
        this.startRun();
    }

    ngAfterViewInit() {
        this.stopwatch = new Stopwatch(
            document.querySelector('.stopwatch'));
        this.stopwatch.start();
        // this.loadGauge();
        /*$('scrolled').on('scroll', function(){
            this.scrolled = true;
        });*/
        // this.subscribeToMqtt();
    }

    openStopDialog(): void {
        const dialogRef = this.dialog.open(StopDialogComponent, {
            data: {
                name: this.runningTestset.name
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog password was closed');
            console.log(result);
            if (result === 1) {
                console.log('Top closed navigated');
                this.killRun();
                if (this.interval) {
                    clearInterval(this.interval);
                }
                this.timeouts.forEach(t => clearTimeout(t));
                if (this.testFailedFlag) {
                    clearTimeout(this.testFailedFlag);
                }
                this.dataService.updateResultByResultId(this.runningTestsetResult.id, this.stopwatch.readTime()).subscribe(
                    data => {
                        console.log(data);
                    }
                );
                this.router.navigate(['overview']);
            }
        });
    }

    ngOnDestroy() {
        // TODO
    }

    loadGauge(index) {
        //    if (document.getElementById('gaugechart')) {failed
        // Create chart instance
        // check if am4chart is already created
        if (!this.chartValues[index]) {
            this.chartValues[index] = {failed: 0, passed: 0};
        }

        this.chart = am4core.create('gaugechart' + index, am4charts.RadarChart);
// Add data
        this.chart.data = [{
            'category': 'Failed Runs',
            'value': this.chartValues[index].failed / this.runningScenarios[index].dataValues.runQuantity * 100,
            'full': 100,
            'fillColors': '#E45150'
        }, {
            'category': 'Passed Runs',
            'value': this.chartValues[index].passed / this.runningScenarios[index].dataValues.runQuantity * 100,
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
        /*const tooltip = $('g [aria-labelledby =\'id-67-title\']') as any;
        if (tooltip.length > 0) {
            tooltip[0].style.visibility = 'hidden';
        }*/

        //  } else {
        //    setTimeout(() => this.loadGauge(), 500);
        //   }
    }

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
                component.timeouts.push(setTimeout(() => component.checkState(), 40000));
                component.timeouts.push(setTimeout(() => component.faultInject(), component.runningScenarios[component.activeScenarioCounter].faultInjectionTime * 1000));
                clearTimeout(component.testFailedFlag);
                // HIER FAULT INJECTION TRIGGERN TOBIAS this.runningScenarios[this.activeScenarioCounter].faultInjectionTime
            }
            const currentDuration = moment.utc(moment().diff(component.activeRunTimestamp)).format('HH:mm:ss:S');
            // console.log(message.toString());
            // let storedNames: RunDetail[];
            // storedNames = JSON.parse(localStorage.getItem('values'));
            component.storedNames.push({
                relativeTime: currentDuration,
                key: topic,
                value: message.toString(),
                runId: component.activeRun.id
            });
            // localStorage.setItem('values', JSON.stringify(storedNames));
            if (component.storedNames.length === 200) {
                const temp = [component.storedNames[0], component.storedNames[1]];
                service.createRunDetailBulk(component.storedNames);
                component.storedNames.length = 0;
                // localStorage.setItem('values', JSON.stringify(storedNames));
            }
        });
    }

    checkState() {
        const component = this;
        this.dataService.updateRunByResultId(this.activeRun.id, moment.utc(moment().diff(this.activeRunTimestamp)).format('HH:mm:ss'),
            component.isTestPassed()).subscribe(
            data => {
                this.killRun();
                if (component.isTestsetEnded()) {
                    // stop fatal
                    this.dataService.updateResultByResultId(this.runningTestsetResult.id, this.stopwatch.readTime()).subscribe(
                        resultData => {
                            console.log(resultData);
                        }
                    );
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
        // service.createRunDetailBulk(storedNames);dataService
        // storedNames.length = 0;
        // localStorage.setItem('values', JSON.stringify(storedNames));
        service.createRun(98970, 'currently running..', 3,
            component.runningScenarios[component.activeScenarioCounter].id, component.runningTestsetResult.id).subscribe(
            runData => {
                component.activeRunTimestamp = undefined;
                const castedData = (runData as any);
                component.activeRun = castedData.dataValues;
                component.activeRunId = component.activeRun.id;
                if (component.interval) {
                    clearInterval(component.interval);
                }
                component.interval = setInterval(() => {service.readLast100RunDetailsByRunResultId(component.activeRunId).subscribe(
                        data => {//
                            component.dataSource[component.activeScenarioCounter].data = data as RunDetail[];
                        }); }, 5000);
                this.testFailedFlag = setTimeout(() => component.clearFailedTest(), 45000);
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
                            const index = component.runningScenarios.findIndex(scenario => scenario.id === castedData[i].scenarioId);
                            refactoredData[index].push(castedData[i]);
                        }
                        component.headerTitle = component.runningScenarios[component.activeScenarioCounter].name;
                        for (let s = 0; s < component.runningScenarios.length; s++) {
                            component.dataSource1[s] = refactoredData[s];
                        }
                        component.headerTitle = component.runningScenarios[component.activeScenarioCounter].name;
                        component.updateGauge(refactoredData);
                    });
            });
    }


    startTestenvironment() {
        this.dataService.readSettingById(1).subscribe(
            data => {
                const component = this;
                const nodePath = (shell.which('node').toString());
                shell.config.execPath = nodePath;
                let textOnly;
                (data as any).isTextOnly ? textOnly = ' -x' : textOnly = '';
                //this.setTrackConfig();
                const command = shell.exec('/home/user1/speed-dreams/build/games/speed-dreams-2 -s quickrace' + textOnly, {
                    silent: false,
                    async: true
                });
                // command.stdout.on('data', (data) => {
                //  });
                component.activeSpeedDreams = command;

                const commands: Array<any> = [];
                const qemuInstances = JSON.parse(component.runningScenarios[component.activeScenarioCounter].file);
                shell.cd('/home/user1/operating-system/');
                const command2 = shell.exec('echo ' + component.password + ' | sudo -S make vde', {
                    silent: false,
                    async: true
                }, function (stdout) {
                    console.log('VDE Output: ', stdout);
                    for (let i = 0; i < qemuInstances.length; i++) {
                        console.log(qemuInstances[i].qemu_args + ' ' + qemuInstances[i].path);
                        let commandConfig = shell.exec(qemuInstances[i].qemu_args + ' ' + qemuInstances[i].path, {
                            silent: false,
                            async: true
                        });
                        commands.push(commandConfig);
                        console.log(commands);
                    }
                    component.activeECUs = commands;
                    // if(flag === 0) {
                    // flag = 1;
                    console.log(qemuInstances.length - 1);
                    component.activeECUs[qemuInstances.length - 1].stdout.on('data', function (data) {
                        console.log('QEMU Instance: ', data);
                        if (data.includes('mosquitto server')) {
                            // const command5 = shell.exec('PROJECT=idp_savm make jenkins_run', {silent: false, async: true});
                            component.activeSAVM = shell.exec('qemu-system-arm -kernel /home/user1/operating-system/build/genode-focnados_pbxa9/var/run/idp_savm/image.elf -machine realview-pbx-a9 -m 1024 -nographic -smp 4 -net nic,macaddr=02:00:00:00:01:02 -net nic,model=e1000 -net vde,sock=/tmp/switch1', {
                                silent: false,
                                async: true
                            });
                            // command4.stdout.on('data', function (data1) {
                            //     if (data1.includes('connected to mosquitto server')) {
                            //         component.stopwatch.start();
                            //     }
                            // });
                        }
                    });
                });
                // let command23 = shell.exec('make vde', {silent: false, async: true});

                // const command3 = shell.exec('PROJECT=idp_acc make jenkins_run', {silent: false, async: true});
                // const command3 = shell.exec('qemu-system-arm -kernel /home/user1/operating-system/build/genode-focnados_pbxa9/var/run/idp_acc/image.elf -machine realview-pbx-a9 -m 1024 -nographic -smp 4 -net nic,macaddr=02:00:00:00:01:03 -net nic,model=e1000 -net vde,sock=/tmp/switch1', {silent: false, async: true});

                //
                // const qemuInstances = JSON.stringify();
                /*$.getJSON( '../../../qemu_config_files/qemu_config_file.json', function( data ) {
                    console.log(data);
                });*/
                // const config = JSON.getFile(component.runningScenarios[component.activeScenarioCounter].path);
            });

    }

    onActiveTabChange(event) {
        console.log('test');
        this.loadGauge(event.index);
    }

    updateGauge(data) {
        // let passedScenarios = 0;
        // let failedScenarios = 0;
        for (let i = 0; i < this.runningScenarios.length; i++) {
            this.chartValues[i] = {failed: 0, passed: 0};
            data[i].forEach(element => {
                if (element.state === 0) {
                    this.chartValues[i].passed++;
                }
                if (element.state === 1) {
                    this.chartValues[i].failed++;
                }
            });
        }
        if (this.tab.selectedIndex === this.activeScenarioCounter
            && (this.chart.data[0]['value'] !== this.chartValues[this.activeScenarioCounter].failed / this.runningScenarios[this.activeScenarioCounter].dataValues.runQuantity * 100
                || this.chart.data[1]['value'] !== this.chartValues[this.activeScenarioCounter].passed / this.runningScenarios[this.activeScenarioCounter].dataValues.runQuantity * 100)) {
            this.chart.data[0]['value'] = this.chartValues[this.activeScenarioCounter].failed / this.runningScenarios[this.activeScenarioCounter].dataValues.runQuantity * 100;
            this.chart.data[1]['value'] = this.chartValues[this.activeScenarioCounter].passed / this.runningScenarios[this.activeScenarioCounter].dataValues.runQuantity * 100;
            this.chart.invalidateData();
        }
    }

    setTrackConfig() {
        const mode = this.runningScenarios[this.activeScenarioCounter].mode;
        const track = this.runningScenarios[this.activeScenarioCounter].route;
        const xmlName = mode + '_' + track + '.xml';
        const command = shell.exec('cd .speed-dreams-2/config/raceman', {silent: false, async: true});
        const command2 = shell.exec('cp quickrace/' + xmlName + ' quickrace.xml', {silent: false, async: true});
    }

    faultInject() {
        const commands: Array<any> = [];
        const component = this;
        const qemuInstances = JSON.parse(component.runningScenarios[component.activeScenarioCounter].file);
        for (let i = 0; i < qemuInstances.length; i++) {
            // kill die ecu mit flag true
            // if activeRun.Time === activeScenarioCounter.faultInjectionTime
            if (qemuInstances[i].faultInjection) {
                this.activeECUs.forEach(ecu => {
                    if (ecu) {
                        const comm = shell.exec('kill -9 ' + (ecu.pid + 1), {silent: false, async: true});
                    }
                });

                setTimeout(function() {
                    const commandConf = shell.exec(qemuInstances[i].qemu_args + ' ' + qemuInstances[i].path, {silent: false, async: true});
                    commands.push(commandConf);
                }, 500
                );

               // this.activeECUs[i].kill('SIGKILL');
               // const comm = shell.exec('kill -9 ' + this.activeECUs[i].pid, {silent: false, async: true});
                // timeout einfügen

            }
        }
        component.activeECUs = commands;
    }

    isTestPassed() {
        if (this.testFailCounter === 1) {
            this.testFailCounter = 0;
            return 1;
        }
        return 0;
    }

    clearFailedTest() {
        this.testFailCounter = 1;
        this.checkState();
    }

    stopTest() {
        this.openStopDialog();
    }

    killRun() {
        this.activeECUs.forEach(ecu => {
            if (ecu) {
                ecu.kill();
            }
        });
        if (this.activeSAVM) {
            this.activeSAVM.kill();
        }
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
