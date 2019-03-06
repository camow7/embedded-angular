import { TestBed, inject } from '@angular/core/testing';

import { UartCommsService } from './uart-comms.service';

describe('UartCommsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UartCommsService]
    });
  });

  it('should be created', inject([UartCommsService], (service: UartCommsService) => {
    expect(service).toBeTruthy();
  }));
});
