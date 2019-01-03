import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  user$: Object;

  constructor(private route: ActivatedRoute, private data: DataService) {
      this.route.params.subscribe( params => this.user$ = params.id );
  }

  ngOnInit() {
      this.data.getResult(this.user$).subscribe(
          data => this.user$ = data
      );
  }

}
