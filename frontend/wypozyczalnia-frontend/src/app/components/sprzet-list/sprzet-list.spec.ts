import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SprzetList } from './sprzet-list';

describe('SprzetList', () => {
  let component: SprzetList;
  let fixture: ComponentFixture<SprzetList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SprzetList],
    }).compileComponents();

    fixture = TestBed.createComponent(SprzetList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
