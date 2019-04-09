import {Component, OnInit, NgZone, AfterViewInit, AfterViewChecked} from '@angular/core';
import {DataService} from '../../data.service';
import {FormControl} from '@angular/forms';
import {MatSort, MatTableDataSource} from '@angular/material';
import {TestsetResult} from '../../models/Result';
import {ActivatedRoute} from '@angular/router';
import {saveAs} from 'file-saver';

@Component({
    selector: 'app-result',
    templateUrl: './result.component.html',
    styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

    // user$: (string|number)[] = [];
    testset;
    scenarios;
    activeResultId;
    activeResult;
    runs = [];
    tabs = [];
    headerTitle = 'Testset1';
    selectedRun;
    selected = new FormControl(0);

    constructor(private route: ActivatedRoute, private dataService: DataService, private zone: NgZone) {
        this.route.params.subscribe(params => {
                this.activeResultId = params.id;
                console.log('logge paramsid');
                console.log(params.id);
                console.log('logge thisuser');
                console.log(this.activeResultId);
            }
        );

    }

    ngOnInit() {
        const component = this;
        this.dataService.readResultByIdObject(this.activeResultId).subscribe(
            data => {
                this.activeResult = data[0].dataValues;
                this.headerTitle = this.activeResult.name;
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

    downloadFile() {
        this.dataService.readAllRunsByResultId(this.activeResultId).subscribe(
            data => {
                const castedData = (data as any);
                for (let i = 0; i < castedData.length; i++) {
                    castedData[i] = castedData[i].dataValues;
                }
                const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
                const header = Object.keys(data[0]);
                let csv = castedData.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
                csv.unshift(header.join(','));
                let csvArray = csv.join('\r\n');

                var blob = new Blob([csvArray], {type: 'text/csv'});
                saveAs(blob, 'bestExport.csv');
            });
    }

    // doFilter = (value: string) => {
    //     if (value === '' || value.length === 1) { this.testsets = this.testsetsOnLoad; }
    //     this.testsets = this.testsets.filter(testset => testset.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    // }

}
