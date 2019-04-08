import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {DataService} from '../../../../../node_modules/mysql2/node_modules/iconv-lite/data.service';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {InterComponentService} from '../../../inter-component.service';
import {Router} from '@angular/router';
import { FileInput } from 'ngx-material-file-input';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
  selector: 'app-create-testset-dialog',
  templateUrl: './create-testset-dialog.component.html',
  styleUrls: ['./create-testset-dialog.component.scss']
})
export class CreateTestsetDialogComponent implements OnInit {


  nameFormControl = new FormControl('', [
      Validators.required,
      // Validators.email,
  ]);
  matcher = new MyErrorStateMatcher();

    inputName = '';


  // @Output() createButtonClicked = new EventEmitter();
  constructor(public dialogRef: MatDialogRef<CreateTestsetDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private dataService: DataService, private interComponentService: InterComponentService, public router: Router,
              private snackBar: MatSnackBar) { }

  ngOnInit() {

  }
  onCreateClick() {
      if (!this.nameFormControl.valid) {
          this.snackBar.open('Please fill in a valid Testset Name', 'DISMISS', {
              duration: 10000,
              panelClass: ['customized-snackbar']
          });
          return ;
      }
      // this.inputName = document.getElementById('create-dialog-name-input').value; // Value works on runtime
      console.log('Created Testset: ' + this.inputName);
      // this.createButtonClicked.emit(this.inputName);
      this.interComponentService.setCreateTestsetName(this.inputName);
      this.dialogRef.close('It was created!');
      this.router.navigate(['create']);
  }

  onNoClick() {
      this.dialogRef.close('It was NOT created!');
  }
}
