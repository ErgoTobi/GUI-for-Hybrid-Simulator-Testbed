import {Component, Input, OnInit} from '@angular/core';
import { Scenario } from '../../models/Scenario';
import { Testset } from '../../models/Testset';
import {MatDialog} from '@angular/material';
import {DeleteDialogComponent} from './delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-overview-detail',
  templateUrl: './overview-detail.component.html',
  styleUrls: ['./overview-detail.component.scss']
})
export class OverviewDetailComponent implements OnInit {
    @Input() testset: Testset;
    constructor(public dialog: MatDialog) {
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
