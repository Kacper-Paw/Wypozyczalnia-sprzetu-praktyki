import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SprzetDetailComponent } from './sprzet-detail';

describe('SprzetDetailComponent', () => {
  let component: SprzetDetailComponent;
  let fixture: ComponentFixture<SprzetDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SprzetDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SprzetDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
