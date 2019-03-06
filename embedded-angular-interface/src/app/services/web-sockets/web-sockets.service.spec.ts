import { TestBed, inject } from '@angular/core/testing';

import { WebSocketsService } from './web-sockets.service';

describe('WebSocketsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebSocketsService]
    });
  });

  it('should be created', inject([WebSocketsService], (service: WebSocketsService) => {
    expect(service).toBeTruthy();
  }));
});
