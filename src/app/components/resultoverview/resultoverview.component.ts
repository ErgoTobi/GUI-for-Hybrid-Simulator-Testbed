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

    test3() {
        this.dataService.updateSuite('Tobi', 'Hi', true);
    }

   /* users$: Object;

    constructor(private data: DataService) { }

    ngOnInit() {
        this.data.getResultData().subscribe(
            data => this.users$ = data
        );
    }*/

}
