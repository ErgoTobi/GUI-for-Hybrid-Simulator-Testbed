import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DataService} from '../../data.service';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SettingsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private dataService: DataService) { }

  ngOnInit() {
  }

    onSaveClick() {
        this.dialogRef.close('It was saved!');
    }

    onNoClick() {
        this.dialogRef.close('It was NOT saved!');
    }
}
