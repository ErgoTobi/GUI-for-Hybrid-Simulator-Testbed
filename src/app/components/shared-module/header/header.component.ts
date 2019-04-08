import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {DataService} from '../../../../../node_modules/mysql2/node_modules/iconv-lite/data.service';
import {OverviewComponent} from '../../overview/overview.component';
import {SettingsDialogComponent} from '../../settings-dialog/settings-dialog.component';
import {interval} from 'rxjs';
import {InterComponentService} from '../../../inter-component.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    // databaseChecked: boolean;
    buttonInHeader: boolean;
    check;

    constructor(private dataService: DataService, public dialog: MatDialog, private overviewComp: OverviewComponent,
                private interComponentService: InterComponentService) { }

    ngOnInit() {
        this.buttonInHeader = true;
        this.check = interval(10 * 1000).subscribe(x => {
            this.dataService.authenticateDatabase();
            // console.log(this.interComponentService.getDatabaseConnected());
            // this.databaseChecked = this.interComponentService.getDatabaseConnected();
        });
    }

    ngOnDestroy(): void {
        this.check.unsubscribe();
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
}
