import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {DataService} from '../../../data.service';
import {OverviewComponent} from '../../overview/overview.component';
import {SettingsDialogComponent} from '../../settings-dialog/settings-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    databaseChecked = false;
    buttonInHeader: boolean;
    check;

    constructor(private dataService: DataService, public dialog: MatDialog, private overviewComp: OverviewComponent) { }

    ngOnInit() {
        this.buttonInHeader = true;
        /*
        this.check = interval(5 * 1000).subscribe(x => {
            this.checkDatabaseConnection();
        });*/
    }

    ngOnDestroy(): void {
        // this.check.unsubscribe();
    }

    openSettingsDialog() {
        const dialogRef = this.dialog.open(SettingsDialogComponent, {
            data: {
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            console.log(result);
            // refresh after setting
            if (result === 1) {
                this.overviewComp.ngOnInit();
            }
        });
    }
    checkDatabaseConnection () {
        this.dataService.authenticateDatabase();
    }

}
