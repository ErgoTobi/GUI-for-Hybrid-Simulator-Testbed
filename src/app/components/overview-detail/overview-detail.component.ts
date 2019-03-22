import {Component, Input, OnInit} from '@angular/core';
import { DataService } from '../../data.service';
import {FormControl} from '@angular/forms';
import {MatSort, MatTableDataSource} from '@angular/material';
import { TestsetResult } from '../../models/TestsetResult';
import { ActivatedRoute } from '@angular/router';
import {SCENARIO, TESTSET} from '../../mock-data';
import {Scenario, Testset} from '../../data';

@Component({
  selector: 'app-overview-detail',
  templateUrl: './overview-detail.component.html',
  styleUrls: ['./overview-detail.component.scss']
})
export class OverviewDetailComponent implements OnInit {
    // user$: (string|number)[] = [];
    // user$: Object;
    @Input() testset: Testset;
    // scenario: Scenario;
    // scenarios = SCENARIO;



    constructor(/*private route: ActivatedRoute, private dataService: DataService*/) {
        /*this.route.params.subscribe( params => {this.user$ = params.id;
                console.log('logge paramsid');
                console.log(params.id);
                console.log('logge thisuser');
                console.log(this.user$);
            }
        );*/

    }

    ngOnInit() {
        /*this.dataService.readTestsetByIdObject(this.user$).subscribe(
            data => {
                this.user$ = data[0];
                console.log("logge data");
                console.log(this.user$);

            }
        );*/

        /*this.scenarios.forEach((element) => {
            if (element.testsetId = this.testset.id){
                this.scenario = element;
            }
        });*/
    }
}
