import { Component, OnInit } from '@angular/core';
import {DataService} from '../../data.service';

@Component({
  selector: 'app-resultoverview',
  templateUrl: './resultoverview.component.html',
  styleUrls: ['./resultoverview.component.scss']
})
export class ResultoverviewComponent implements OnInit {

    constructor(private dataService: DataService) { }

    ngOnInit() {

    }

    testCarmen1() {
        const carmen1 = this.dataService.readAllTestsetresult();
        console.log(carmen1[1]);
    }
    testCarmen2() {
        const carmen2 = this.dataService.readTestsetresult(2);
        console.log('show id');
        console.log(carmen2);
    }

   /* users$: Object;

    constructor(private data: DataService) { }

    ngOnInit() {
        this.data.getResultData().subscribe(
            data => this.users$ = data
        );
    }*/

}
