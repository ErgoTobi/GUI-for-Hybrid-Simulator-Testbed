import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-resultoverview',
  templateUrl: './resultoverview.component.html',
  styleUrls: ['./resultoverview.component.scss']
})
export class ResultoverviewComponent implements OnInit {

  users$: Object;

  constructor(private data: DataService) { }

  ngOnInit() {
      this.data.getResultData().subscribe(
          data => this.users$ = data
      );
  }

}
