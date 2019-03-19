import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../../data.service';


@Component({
  selector: 'app-resultoverview',
  templateUrl: './resultoverview.component.html',
  styleUrls: ['./resultoverview.component.scss']
})
export class ResultoverviewComponent implements OnInit {
    title = 'Data binding using String Interpolation';
    @ViewChild('lastNameInput') nameInputRef: ElementRef;
    // test = this.testCarmen2();
    users$: Object;

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.dataService.readAllTestsetResultsOnly().subscribe(
            data => {this.users$ = data; console.log(data); }
        );
    }

    testCarmen1() {
        const carmen1 = this.dataService.readAllTestsetResultsOnly();
        console.log('did the first thing');
        // console.log(carmen1[0].name);
        // const carmen1_1 = carmen1[1].get('name');
        console.log('did the second thing');
        // console.log(carmen1_1);
    }
    testCarmen2() {
        const carmen2 = this.dataService.readAllTestsetResultsOnly();
        console.log('show id');
        console.log(carmen2);
        this.dataService.readAllTestsetResultsOnly().subscribe(
            data => {this.users$ = data; console.log(data); }
        );
        // this.dataService.readAllTestsetResult().subscribe({
         //   next: function() {}}
         // );
    }


   /* users$: Object;

    constructor(private data: DataService) { }

    ngOnInit() {
        this.data.getResultData().subscribe(
            data => this.users$ = data
        );
    }*/

}
