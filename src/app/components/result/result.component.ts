import {Component, OnInit, NgZone, AfterViewInit, AfterViewChecked} from '@angular/core';
import {DataService} from '../../data.service';
import {FormControl} from '@angular/forms';
import {MatSort, MatTableDataSource} from '@angular/material';
import { TestsetResult } from '../../models/Result';
import { ActivatedRoute } from '@angular/router';
import {InterComponentService} from '../../inter-component.service';
import {saveAs} from 'file-saver';

@Component({
    selector: 'app-result',
    templateUrl: './result.component.html',
    styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

    testset;
    scenarios;
    activeResultId;
    activeResultArray: TestsetResult[];
    activeResult: TestsetResult;
    runs = [];
    tabs = [];
    headerTitle = 'Testset1';
    selectedRun;
    selected = new FormControl(0);
    createdAt;
    downloadData = [];

    constructor(private route: ActivatedRoute, private dataService: DataService, private zone: NgZone,
        private interComponentService: InterComponentService) {
        this.route.params.subscribe(params => {
                this.activeResultId = params.testset;
                console.log('logge paramsid');
                console.log(params.id);
                console.log('logge thisuser');
                console.log(this.activeResultId);
            }
        );

    }

    ngOnInit() {
        this.interComponentService.setButtonHeaderActive(false);
        const component = this;
        this.dataService.readResultByIdObject(this.activeResultId).subscribe(
            data => {
                this.activeResultArray = data as TestsetResult[];
                this.activeResult = this.activeResultArray[0];
                this.headerTitle = this.activeResult.name;
                this.createdAt = this.activeResult.createdAt;
                this.dataService.readTestsetById(this.activeResult.testsetId).subscribe(
                    data => {
                        const tabs = this.tabs;
                        const castedData = (data as any);
                        castedData.scenarios.forEach(element => {
                            tabs.push(element.name);
                           // component.runs[element.id] = [];
                        });
                        this.testset = castedData.dataValues;
                        this.scenarios = this.testset.scenarios;
                        for (let s = 0; s < this.scenarios.length; s++) {
                            this.runs[s] = [];
                        }
                        this.dataService.readAllRunsByResultId(this.activeResultId).subscribe(
                            data => {
                                const castedData = (data as any);
                                for (let i = 0; i < castedData.length; i++) {
                                    const index = this.scenarios.findIndex( scenario => scenario.id === castedData[i].scenarioId);
                                    if (index >= -1) {
                                        this.runs[index].push(castedData[i].dataValues);
                                    }
                                }
                                this.selectedRun = this.runs[0][0];
                                //this.runs[0] = castedData;
                                console.log('logge data');
                                console.log(this.runs);

                            }
                        );
                    });
            }
        );
    }
    onSelect(run) {
        this.selectedRun = run;
        console.log(this.selectedRun);
    }
    // Downloads all rundetail-data
    downloadFile() {
        this.dataService.readAllRunsByResultId(this.activeResultId).subscribe(
            runData => {
                for (let s = 0; s < (runData as any).length; s++) {
                    this.dataService.readAllRunDetailsByRunId(runData[s].dataValues.id).subscribe(
                        data => {
                            const castedData = (data as any);
                            for (let i = 0; i < castedData.length; i++) {
                                this.downloadData.push(castedData[i].dataValues);
                            }
                            if (s === (runData as any).length - 1) {
                                const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
                                const header = Object.keys(this.downloadData[0]);
                                const csv = this.downloadData.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
                                csv.unshift(header.join(','));
                                const csvArray = csv.join('\r\n');

                                const blob = new Blob([csvArray], {type: 'text/csv'});
                                saveAs(blob, 'Export.csv');
                            }
                        });
                }
            }
        );
    }
    // Downloads all scenario set-ups
    downloadSetup() {
        const replacer2 = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
        const header2 = Object.keys(this.scenarios[0].dataValues);
        const csv2 = this.scenarios.map(row2 => header2.map(fieldName => JSON.stringify(row2[fieldName], replacer2)).join(','));
        csv2.unshift(header2.join(','));
        const csvArray2 = csv2.join('\r\n');

        const blob2 = new Blob([csvArray2], {type: 'text/csv'});
        saveAs(blob2, 'Set-up.csv');
    }

}

