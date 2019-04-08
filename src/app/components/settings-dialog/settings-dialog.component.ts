import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {DataService} from '../../data.service';
import {Setting} from '../../models/Setting';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent implements OnInit {
    isCheckedDatabase: boolean;
    isCheckedResults: boolean;
    setting: Setting;
    isCheckedVisualization: boolean;

  constructor(public dialogRef: MatDialogRef<SettingsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private dataService: DataService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.isCheckedDatabase = false;
    this.isCheckedResults = false;
    this.dataService.readSettingById(1).subscribe(
        data => {
            this.setting = data as Setting;
            this.isCheckedVisualization = this.setting.isTextOnly;
        }
    );

  }

  onSaveClick() {
    if (this.isCheckedDatabase || this.isCheckedResults) {
      if (this.isCheckedResults) {
        this.dataService.clearAllResultstsInDatabase();
      }
      if (this.isCheckedDatabase) {
          this.dataService.clearAllTestsetsInDatabase();
      }
      this.snackBar.open(this.isCheckedDatabase ? 'Database was flushed!' : 'Results were flushed!', 'DISMISS', {
          duration: 5000,
          panelClass: ['customized-snackbar']
      });
    }
    if (this.isCheckedVisualization !== this.setting.isTextOnly) {
      this.dataService.updateSetting(this.setting.id, this.isCheckedVisualization);
    }
    this.dialogRef.close(1);
  }

  onNoClick() {
    this.dialogRef.close(0);
  }
}
