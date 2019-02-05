import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlStateComponent } from './control-state.component';

describe('ControlStateComponent', () => {
  let component: ControlStateComponent;
  let fixture: ComponentFixture<ControlStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
