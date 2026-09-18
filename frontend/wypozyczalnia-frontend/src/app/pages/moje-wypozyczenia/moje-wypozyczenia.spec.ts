import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojeWypozyczeniaComponent } from './moje-wypozyczenia';

describe('MojeWypozyczenia', () => {
  let component: MojeWypozyczeniaComponent;
  let fixture: ComponentFixture<MojeWypozyczeniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojeWypozyczeniaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojeWypozyczeniaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
