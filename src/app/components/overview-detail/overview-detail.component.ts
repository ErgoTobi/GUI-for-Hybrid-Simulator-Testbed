import {Component, Input, OnInit} from '@angular/core';
import { DataService } from '../../data.service';
import {FormControl} from '@angular/forms';
import {MatSort, MatTableDataSource} from '@angular/material';
import { Scenario } from '../../models/Scenario';
import { Testset } from '../../models/Testset';
import { ActivatedRoute } from '@angular/router';
import {MatDialog} from '@angular/material';
import {DeleteDialogComponent} from './delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-overview-detail',
  templateUrl: './overview-detail.component.html',
  styleUrls: ['./overview-detail.component.scss']
})
export class OverviewDetailComponent implements OnInit {
    // user$: (string|number)[] = [];
    // user$: Object;
    @Input() testset: Testset;
    constructor(/*private route: ActivatedRoute, */public dialog: MatDialog) {
        /*this.route.params.subscribe( params => {this.user$ = params.id;
                console.log('logge paramsid');
                console.log(params.id);
                console.log('logge thisuser');
                console.log(this.user$);
            }
        );*/
    }

    ngOnInit() {
    }
    openDeleteDialog(name: string, id: number): void {
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
            data: {
                name: name,
                id: id
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            console.log(result);
        });
    }
}
