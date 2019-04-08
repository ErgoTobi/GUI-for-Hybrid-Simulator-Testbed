import {Component, Input, OnInit} from '@angular/core';
import { Scenario } from '../../models/Scenario';
import { Testset } from '../../models/Testset';
import {MatDialog} from '@angular/material';
import {DeleteDialogComponent} from './delete-dialog/delete-dialog.component';
import {InterComponentService} from '../../inter-component.service';
import {DataService} from '../../data.service';
import {OverviewComponent} from '../overview/overview.component';
import {PasswordDialogComponent} from './password-dialog/password-dialog.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-overview-detail',
  templateUrl: './overview-detail.component.html',
  styleUrls: ['./overview-detail.component.scss']
})
export class OverviewDetailComponent implements OnInit {
    @Input() testset: Testset;
    constructor(public dialog: MatDialog, private interComponentService: InterComponentService, private overviewComp: OverviewComponent,
                public router: Router) {}

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

    openPasswordDialog(): void {
        const dialogRef = this.dialog.open(PasswordDialogComponent, {
            data: {
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog password was closed');
            console.log(result);
            if (result === 1) {
                console.log('navigated');
                // this.router.navigate(['run']);
            }
        });
    }
    onStartClick() {
        this.interComponentService.setRunTestsetId(this.testset.id);
        if (this.interComponentService.getAdminPassword() === '' || this.interComponentService.getAdminPassword() === null) {
            console.log('Password Dialog');
            this.openPasswordDialog();
        } else {
            console.log('StartTestsetId: ' + this.interComponentService.getRunTestsetId());
        }

    }
}
