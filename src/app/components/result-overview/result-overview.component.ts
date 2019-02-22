import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-result-overview',
  templateUrl: './result-overview.component.html',
  styleUrls: ['./result-overview.component.scss']
})
export class ResultOverviewComponent implements OnInit {

    users$: Object;

    constructor(private data: DataService) { }

    ngOnInit() {
        this.data.getResultData().subscribe(
            data => this.users$ = data
        );
    }

}