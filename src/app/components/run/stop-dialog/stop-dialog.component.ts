import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-stop-dialog',
  templateUrl: './stop-dialog.component.html',
  styleUrls: ['./stop-dialog.component.scss']
})
export class StopDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<StopDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit() {
    }

    onYesClick() {
        this.dialogRef.close(1);
    }

    onNoClick() {
        this.dialogRef.close(0);
    }

}
