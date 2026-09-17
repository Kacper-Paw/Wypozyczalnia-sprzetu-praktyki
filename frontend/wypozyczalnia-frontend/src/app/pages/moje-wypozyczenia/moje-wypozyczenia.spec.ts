import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojeWypozyczenia } from './moje-wypozyczenia';

describe('MojeWypozyczenia', () => {
  let component: MojeWypozyczenia;
  let fixture: ComponentFixture<MojeWypozyczenia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojeWypozyczenia],
    }).compileComponents();

    fixture = TestBed.createComponent(MojeWypozyczenia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
