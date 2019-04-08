import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';
import {DataService} from '../../../../../node_modules/mysql2/node_modules/iconv-lite/data.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private dataService: DataService) {}

  ngOnInit() {
  }

  onDeleteClick() {
    this.dialogRef.close(1);
    this.dataService.deleteTestsetById(this.data.id);
  }

  onNoClick() {
      this.dialogRef.close(0);
  }

}
