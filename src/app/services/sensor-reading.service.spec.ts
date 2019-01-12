import { TestBed } from '@angular/core/testing';

import { SensorReadingService } from './sensor-reading.service';

describe('SensorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SensorReadingService = TestBed.get(SensorReadingService);
    expect(service).toBeTruthy();
  });
});
