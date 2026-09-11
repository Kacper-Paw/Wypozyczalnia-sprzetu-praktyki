import { TestBed } from '@angular/core/testing';
import { SprzetService } from './sprzet';

describe('SprzetService', () => {
  let service: SprzetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SprzetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
