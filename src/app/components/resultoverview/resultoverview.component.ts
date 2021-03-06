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
                const castedData = data as any;
                for (let i = 0; i < castedData.length; i++) {
                    castedData[i] = castedData[i].dataValues;
                }
                this.dataSource.data = castedData;
                console.log(data);
                console.log(this.dataSource.data);
                this.dataSource.data.map((obj) => {
                    let count = 0;
                    for (let i = 0; i < obj.runs.length; i++ ) {
                        if (obj.runs[i]) {
                            if (obj.runs[i].state === 1 || obj.runs[i].state === 3) {
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
    doFilter(value: string) {
        this.dataSource.filter = value.trim().toLocaleLowerCase();
    }

    onRowClicked(row) {
        console.log('Row clicked: ', row);
        console.log('id of row');
        console.log(row.id);
    }
}
