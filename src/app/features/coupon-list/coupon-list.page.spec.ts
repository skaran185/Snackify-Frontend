import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CouponListPage } from './coupon-list.page';

describe('CouponListPage', () => {
  let component: CouponListPage;
  let fixture: ComponentFixture<CouponListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
