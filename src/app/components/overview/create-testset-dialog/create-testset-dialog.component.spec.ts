import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTestsetDialogComponent } from './create-testset-dialog.component';

describe('CreateTestsetDialogComponent', () => {
  let component: CreateTestsetDialogComponent;
  let fixture: ComponentFixture<CreateTestsetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTestsetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTestsetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
