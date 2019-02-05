import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorReadingListComponent } from './sensor-reading-list.component';

describe('SensorReadingListComponent', () => {
  let component: SensorReadingListComponent;
  let fixture: ComponentFixture<SensorReadingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorReadingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorReadingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
