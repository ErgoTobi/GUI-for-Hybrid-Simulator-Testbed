import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DataService} from '../../../data.service';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';

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

  constructor(public dialogRef: MatDialogRef<CreateTestsetDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private dataService: DataService) { }

  ngOnInit() {
  }
  onCreateClick() {
      this.dialogRef.close('It was created!');
  }

  onNoClick() {
      this.dialogRef.close('It was NOT created!');
  }
}
