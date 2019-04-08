import {Component, Inject, OnInit} from '@angular/core';
import {ErrorStateMatcher, MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {DataService} from '../../data.service';
import {Setting} from '../../models/Setting';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {InterComponentService} from '../../inter-component.service';


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

    passwordFormControl = new FormControl('');

  constructor(public dialogRef: MatDialogRef<SettingsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private dataService: DataService, private snackBar: MatSnackBar, private interComponentService: InterComponentService) { }

  ngOnInit() {
    this.isCheckedDatabase = false;
    this.isCheckedResults = false;
    this.dataService.readSettingById(1).subscribe(
        data => {
            this.setting = data as Setting;
            this.isCheckedVisualization = this.setting.isTextOnly;
        }
    );
    this.passwordFormControl.setValue(this.interComponentService.getAdminPassword());

  }

  onSaveClick() {
    this.interComponentService.setAdminPassword(this.passwordFormControl.value);
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
