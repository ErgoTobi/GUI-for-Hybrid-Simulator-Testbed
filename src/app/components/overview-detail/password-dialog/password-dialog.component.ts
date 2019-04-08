import {Component, Inject, OnInit} from '@angular/core';
import {ErrorStateMatcher, MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {DataService} from '../../../data.service';
import {FormControl, FormGroupDirective, NgForm} from '@angular/forms';
import {MyErrorStateMatcher} from '../../create/create.component';
import {InterComponentService} from '../../../inter-component.service';

@Component({
  selector: 'app-password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.scss']
})
export class PasswordDialogComponent implements OnInit {

    passwordFormControl = new FormControl('');
    constructor(public dialogRef: MatDialogRef<PasswordDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
                private dataService: DataService, private interComponentService: InterComponentService,
                private snackBar: MatSnackBar) {}

    ngOnInit() {
    }

    onContinueClick() {
      if (!this.passwordFormControl.valid) {
          this.snackBar.open('The Admin Password is required', 'DISMISS', {
              duration: 5000,
              panelClass: ['customized-snackbar']
          });
      } else if (this.passwordFormControl.valid) {
        this.interComponentService.setAdminPassword(this.passwordFormControl.value);
          this.dialogRef.close(1);
      }
    }

    onNoClick() {
        this.dialogRef.close(0);
    }

}
