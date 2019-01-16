import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleChartComponent } from './rule-chart.component';

describe('ProgramChartComponent', () => {
  let component: RuleChartComponent;
  let fixture: ComponentFixture<RuleChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
