import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {

  @Input() order: any;

  constructor() { }

  ngOnInit() { }

  getItemPrice(item: any) {
    if (item.menuItemVariationID) {
      const variation = item.menuItem.menuItemVariations.find(
        (v: any) => v.menuItemVariationId === item.menuItemVariationID
      );

      return variation ? variation.price : item.menuItem.price;
    }

    return item.menuItem.price;
  }

}
