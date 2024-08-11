

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpCandidatesComponent } from './pp-candidates.component';


describe('NewComponent', () => {
  let component: PpCandidatesComponent;
  let fixture: ComponentFixture<PpCandidatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpCandidatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
