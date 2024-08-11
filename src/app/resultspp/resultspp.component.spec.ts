import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsComponentpp } from './resultspp.component';

describe('ResultsComponentpp', () => {
  let component: ResultsComponentpp;
  let fixture: ComponentFixture<ResultsComponentpp>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsComponentpp ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsComponentpp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
