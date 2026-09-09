import { TestBed } from '@angular/core/testing';
import { Sprzet } from './sprzet';

describe('Sprzet', () => {
  let service: Sprzet;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sprzet);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
