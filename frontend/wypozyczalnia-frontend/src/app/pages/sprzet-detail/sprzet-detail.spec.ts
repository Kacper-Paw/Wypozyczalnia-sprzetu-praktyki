import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SprzetDetail } from './sprzet-detail';

describe('SprzetDetail', () => {
  let component: SprzetDetail;
  let fixture: ComponentFixture<SprzetDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SprzetDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(SprzetDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
