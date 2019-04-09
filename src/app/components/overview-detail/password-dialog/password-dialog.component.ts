import {Component, Inject, OnInit} from '@angular/core';
import {ErrorStateMatcher, MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {DataService} from '../../../data.service';
import {FormControl, FormGroupDirective, NgForm} from '@angular/forms';
import {MyErrorStateMatcher} from '../../create/create.component';
import {InterComponentService} from '../../../inter-component.service';
import {EncrDecrService} from '../../../encr-decr.service';

@Component({
  selector: 'app-password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.scss']
})
export class PasswordDialogComponent implements OnInit {
    encrypted: string;
    decrypted: string;
    passwordFormControl = new FormControl('');
    constructor(public dialogRef: MatDialogRef<PasswordDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
                private dataService: DataService, private interComponentService: InterComponentService,
                private snackBar: MatSnackBar, private EncrDecr: EncrDecrService) {}

    ngOnInit() {
        console.log(this.encrypted);
        console.log(this.passwordFormControl.value);
    }

    onContinueClick() {
      if (!this.passwordFormControl.valid) {
          this.snackBar.open('The Admin Password is required for this session.', 'DISMISS', {
              duration: 5000,
              panelClass: ['customized-snackbar']
          });
      } else if (this.passwordFormControl.valid) {
            this.encrypted = this.EncrDecr.set('123456$#@$^@1ERF', this.passwordFormControl.value);
            console.log(this.encrypted);
            console.log(this.passwordFormControl.value);
            this.interComponentService.setAdminPassword(this.encrypted);
            this.dialogRef.close(1);
      }
    }

    onNoClick() {
        this.dialogRef.close(0);
    }

}
