import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverrideListComponent } from './override-list.component';

describe('OverrideListComponent', () => {
  let component: OverrideListComponent;
  let fixture: ComponentFixture<OverrideListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverrideListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverrideListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
