import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultoverviewComponent } from './resultoverview.component';

describe('ResultoverviewComponent', () => {
  let component: ResultoverviewComponent;
  let fixture: ComponentFixture<ResultoverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultoverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
