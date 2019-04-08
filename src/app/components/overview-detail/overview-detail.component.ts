import {Component, Input, OnInit} from '@angular/core';
import { Scenario } from '../../models/Scenario';
import { Testset } from '../../models/Testset';
import {MatDialog} from '@angular/material';
import {DeleteDialogComponent} from './delete-dialog/delete-dialog.component';
import {InterComponentService} from '../../inter-component.service';
import {DataService} from '../../data.service';
import {OverviewComponent} from '../overview/overview.component';

@Component({
  selector: 'app-overview-detail',
  templateUrl: './overview-detail.component.html',
  styleUrls: ['./overview-detail.component.scss']
})
export class OverviewDetailComponent implements OnInit {
    @Input() testset: Testset;
    constructor(public dialog: MatDialog, private interComponentService: InterComponentService, private overviewComp: OverviewComponent) {}

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
            // Refresh list in overview when deleted (1)
            if (result === 1) {
                this.overviewComp.ngOnInit();
            }
        });
    }
    onStartClick() {
        this.interComponentService.setRunTestsetId(this.testset.id);
        console.log('StartTestsetId: ' + this.interComponentService.getRunTestsetId());
    }
}
