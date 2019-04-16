import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramUseComponent } from './program-use.component';

describe('ProgramUseComponent', () => {
  let component: ProgramUseComponent;
  let fixture: ComponentFixture<ProgramUseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramUseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
