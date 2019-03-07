import { Component, OnInit } from '@angular/core';
import {DataService} from '../../data.service';
import {FormControl} from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import {testsetresult} from '../../models/testsetresult.js';


@Component({
  selector: 'app-resultoverview',
  templateUrl: './resultoverview.component.html',
  styleUrls: ['./resultoverview.component.scss']
})
export class ResultoverviewComponent implements OnInit {
    title = 'Data binding using String Interpolation';
    // test = this.testCarmen2();
    users$: Object;
    public displayedColumns = ['name', 'id', 'duration', 'Testset_id'];
    dataSource = new MatTableDataSource<testsetresult>();
    tabs = ['First', 'Second', 'Third'];
    selected = new FormControl(0);

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.dataService.readAllTestsetResult().subscribe(
            data => {this.dataSource.data = data as testsetresult[]; console.log(data); }
        );
    }

    testCarmen1() {
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
    }

    addTab(selectAfterAdding: boolean) {
        this.tabs.push('New');

        if (selectAfterAdding) {
            this.selected.setValue(this.tabs.length - 1);
        }
    }

    removeTab(index: number) {
        this.tabs.splice(index, 1);
    }

    startTest() {
        console.log('test');
    }
    /*navigateTo(item, event) {
      this.activeItem = item;
    }*/
}



/* users$: Object;

 constructor(private data: DataService) { }

 ngOnInit() {
     this.data.getResultData().subscribe(
         data => this.users$ = data
     );
 }*/



/* LIST CODE */

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
