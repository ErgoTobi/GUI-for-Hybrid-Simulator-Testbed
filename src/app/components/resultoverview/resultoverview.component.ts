import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Observable } from 'rxjs';
import { FilterPipe } from 'ngx-filter-pipe';

@Component({
  selector: 'app-resultoverview',
  templateUrl: './resultoverview.component.html',
  styleUrls: ['./resultoverview.component.scss']
})
export class ResultoverviewComponent implements OnInit {

  users$: Object;
  order: string = 'name';
  reverse: boolean = false;
  userFilter: any = { name: '', email: '', website:''}
  // userFilter: any = {$or: ['name', 'email', 'website']};
    // userFilter: any = {} ;


  constructor(private data: DataService) { }

  ngOnInit() {
      this.data.getResultData().subscribe(
          data => this.users$ = data
      );
  }

  changeOrder(value: string) {
    if (this.order === value) {
        this.reverse = !this.reverse;
        console.log('changed reverse order');
    }
    this.order =  value;

  }

}
