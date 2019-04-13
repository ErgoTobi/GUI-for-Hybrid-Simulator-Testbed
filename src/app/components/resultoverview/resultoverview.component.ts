import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../../data.service';
import {FormControl} from '@angular/forms';
import {MatSort, MatTableDataSource} from '@angular/material';
import {Result} from '../../models/Result';
import {InterComponentService} from '../../inter-component.service';

@Component({
    selector: 'app-resultoverview',
    templateUrl: './resultoverview.component.html',
    styleUrls: ['./resultoverview.component.scss']
})
export class ResultoverviewComponent implements OnInit, AfterViewInit, OnDestroy  {
    subscription;
    public displayedColumns = ['name', 'createdAt', 'duration', 'result'];
    dataSource = new MatTableDataSource<Result>();

    @ViewChild(MatSort) sort: MatSort;

    constructor(private dataService: DataService, private interComponentService: InterComponentService) {
    }

    ngOnInit() {
        this.interComponentService.setButtonHeaderActive(false);
        this.subscription = this.dataService.readAllResults().subscribe(
            data => {
                this.dataSource.data = data as Result[];
                console.log(data);
                console.log(this.dataSource.data);
                this.dataSource.data.map((obj) => {
                    let count = 0;
                    for (let i = 0; i < obj.runs.length; i++ ) {
                        if (obj.runs[i].state) {
                            if (obj.runs[i].state === 0 || obj.runs[i].state === 3) {
                                count++;
                            }
                        }
                    }
                    obj['failedNumberResults'] = count;
                    obj['totalNumberResults'] = obj.runs.length;
                    return obj;
                });
            }
        );
    }
    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    doFilter (value: string) {
        console.log(this.dataSource);
        console.log(value);
        value = value.trim();
        value = value.toLowerCase();
        console.log(value);
        this.dataSource.filter = value;
        console.log(this.dataSource.filteredData);
    }

    onRowClicked(row) {
        console.log('Row clicked: ', row);
        console.log('id of row');
        console.log(row.id);
    }

}

/*    testCarmen1() {
        const carmen1 = this.dataService.readAllTestsetResult();
        console.log('did the first thing');
        // console.log(carmen1[0].name);
        // const carmen1_1 = carmen1[1].get('name');
        console.log('did the second thing');
        // console.log(carmen1_1);
    }
    testCarmen2() {
        const carmen2 = this.dataService.readTestsetresult(2);
        console.log('show id');
        console.log(carmen2);
        this.dataService.readAllTestsetResult().subscribe(
            data => {this.users$ = data; console.log(data); }
        );
        // this.dataService.readAllTestsetResult().subscribe({
         //   next: function() {}}
         // );
    }*/


/* users$: Object;

 constructor(private data: DataService) { }

 ngOnInit() {
     this.data.getResultData().subscribe(
         data => this.users$ = data
     );
 }*/



/* LIST CODE */

