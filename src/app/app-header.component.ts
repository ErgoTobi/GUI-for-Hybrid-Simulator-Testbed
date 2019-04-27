import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {DataService} from './data.service';
import {OverviewComponent} from './components/overview/overview.component';
import {SettingsDialogComponent} from './components/settings-dialog/settings-dialog.component';
import {interval} from 'rxjs';
import {InterComponentService} from './inter-component.service';
import {EncrDecrService} from './encr-decr.service';
import {Setting} from './models/Setting';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
    // databaseChecked: boolean;
    logo;
    buttonInHeader: boolean;
    check;
    encrypted: string;
    decrypted: string;
    setting: Setting;

    constructor(private dataService: DataService, public dialog: MatDialog,
                public interComponentService: InterComponentService, private EncrDecr: EncrDecrService, private router: Router) { }

    ngOnInit() {
        // Assignment of logo
        this.logo = document.getElementById('header-logo') as HTMLImageElement;
        this.logo.src = './assets/logo.png';
        // Button navigation
        this.buttonInHeader = true;
        // Sets AdminPassword in case database carries one
        this.dataService.readSettingById(1).subscribe(
            data => {
                this.setting = data as Setting;
                this.encrypted = this.setting.password;
                if (this.encrypted !== null) {
                    this.interComponentService.setAdminPassword(this.encrypted);
                } else {
                    this.interComponentService.setAdminPassword(this.EncrDecr.set('123456$#@$^@1ERF', ''));
                }

            }
        );
        // First Check
        this.dataService.authenticateDatabase();
        // Continuous check
        this.check = interval(10 * 1000).subscribe(x => {
            this.dataService.authenticateDatabase();
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
                location.reload();
            }
        });
    }
}
