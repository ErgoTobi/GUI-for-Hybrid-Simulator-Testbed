import {Component, Input, AfterContentChecked} from '@angular/core';
import {Scenario} from '../../models/Scenario';
import {Testset} from '../../models/Testset';
import {MatDialog} from '@angular/material';
import {DeleteDialogComponent} from './delete-dialog/delete-dialog.component';
import {InterComponentService} from '../../inter-component.service';
import {OverviewComponent} from '../overview/overview.component';
import {PasswordDialogComponent} from './password-dialog/password-dialog.component';
import {Router} from '@angular/router';
import {EncrDecrService} from '../../encr-decr.service';
import moment from 'moment';

@Component({
    selector: 'app-overview-detail',
    templateUrl: './overview-detail.component.html',
    styleUrls: ['./overview-detail.component.scss']
})
export class OverviewDetailComponent implements AfterContentChecked {
    decrypted: string;
    estimatedTime;
    @Input() testset: Testset;

    constructor(public dialog: MatDialog, private interComponentService: InterComponentService, private overviewComp: OverviewComponent,
                public router: Router, private EncrDecr: EncrDecrService) {
    }

    ngAfterContentChecked() {
        this.calculateEstimate();
    }

    // Gives a rough estimation for the time needed on basis of the run amount set for all scenarios
    calculateEstimate() {
        if (this.testset) {
            let secondsToFinish = 0;
            for (let s = 0; s < this.testset.scenarios.length; s++) {
                secondsToFinish += this.testset.scenarios[s].runQuantity * 240;
                this.estimatedTime = moment().add(this.testset.scenarios[s].runQuantity * 240, 'seconds').format('llll');

            }
        } else {
            setTimeout(() => this.calculateEstimate(), 500);
        }
    }

    // A Deletion of a testset triggers this confirmation dialog
    openDeleteDialog(name: string, id: number): void {
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
            data: {
                name: name,
                id: id
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            // Refresh list in overview when deleted (1)
            if (result === 1) {
                this.overviewComp.ngOnInit();
            }
        });
    }

    // A runtime variable for admin password needs to be passed to the console
    openPasswordDialog(): void {
        const dialogRef = this.dialog.open(PasswordDialogComponent, {
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 1) {
                this.router.navigate(['run']);
                this.interComponentService.setRunTestsetId(this.testset.id);
            }
        });
    }

    onStartClick() {
        // Checks if a password was already set during runtime or permanently in the settings dialog
        if (this.interComponentService.getAdminPassword() !== '' || this.interComponentService.getAdminPassword() !== null) {
            this.decrypted = this.EncrDecr.get('123456$#@$^@1ERF', this.interComponentService.getAdminPassword());
        }
        if (this.decrypted === '' || this.decrypted === null) {
            this.openPasswordDialog();
        } else {
            this.interComponentService.setRunTestsetId(this.testset.id);
            this.router.navigate(['run']);
        }
    }
}
