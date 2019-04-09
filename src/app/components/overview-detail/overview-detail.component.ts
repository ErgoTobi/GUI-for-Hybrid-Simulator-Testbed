import {Component, Input, OnInit} from '@angular/core';
import { Scenario } from '../../models/Scenario';
import { Testset } from '../../models/Testset';
import {MatDialog, MatSnackBar} from '@angular/material';
import {DeleteDialogComponent} from './delete-dialog/delete-dialog.component';
import {InterComponentService} from '../../inter-component.service';
import {DataService} from '../../data.service';
import {OverviewComponent} from '../overview/overview.component';
import {PasswordDialogComponent} from './password-dialog/password-dialog.component';
import {Router} from '@angular/router';
import {EncrDecrService} from '../../encr-decr.service';

@Component({
  selector: 'app-overview-detail',
  templateUrl: './overview-detail.component.html',
  styleUrls: ['./overview-detail.component.scss']
})
export class OverviewDetailComponent implements OnInit {
    encrypted: string;
    decrypted: string;
    @Input() testset: Testset;
    constructor(public dialog: MatDialog, private interComponentService: InterComponentService, private overviewComp: OverviewComponent,
                public router: Router, private EncrDecr: EncrDecrService) {}

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
                console.log('StartTestsetId: ' + this.interComponentService.getRunTestsetId());
                this.interComponentService.setRunTestsetId(this.testset.id);
            }
        });
    }
    onStartClick() {
        console.log('1:' + this.interComponentService.getAdminPassword());
        console.log('1:' + this.decrypted);
        if (this.interComponentService.getAdminPassword() !== '' || this.interComponentService.getAdminPassword() !== null) {
            this.decrypted = this.EncrDecr.get('123456$#@$^@1ERF', this.interComponentService.getAdminPassword());
        }
        console.log('2:' + this.interComponentService.getAdminPassword());
        console.log('2:' + this.decrypted);
        if (this.decrypted === '' || this.decrypted === null) {
            console.log('Password Dialog');
            this.openPasswordDialog();
        } else {
            console.log('StartTestsetId: ' + this.interComponentService.getRunTestsetId());
            this.interComponentService.setRunTestsetId(this.testset.id);
            // this.router.navigate(['run']);
            console.log('StartTestsetId: ' + this.interComponentService.getRunTestsetId());
        }
    }
}
