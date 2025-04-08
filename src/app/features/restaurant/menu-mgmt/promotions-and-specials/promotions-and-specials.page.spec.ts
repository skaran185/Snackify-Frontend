import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PromotionsAndSpecialsPage } from './promotions-and-specials.page';

describe('PromotionsAndSpecialsPage', () => {
  let component: PromotionsAndSpecialsPage;
  let fixture: ComponentFixture<PromotionsAndSpecialsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionsAndSpecialsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
