import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-item-customization-modal',
  templateUrl: './item-customization-modal.component.html',
  styleUrls: ['./item-customization-modal.component.scss'],
})
export class ItemCustomizationModalComponent {
  @Input() item: any;
  @Input() isCustomize :boolean=false;
  selectedVariation: any;
  customQuantity:number=0;

  constructor(private modalController: ModalController) {
  }

  ionViewDidEnter() {
    this.selectedVariation = this.item.variations[0];
    // this.basePrice=this.item.variations.max((c:any)=>c.price)
  }

  selectVariation(variation: any) {
    this.selectedVariation = variation;
  }

  confirm() {
    this.modalController.dismiss({
      'selectedVariation': this.selectedVariation
    });
  }

  cancel() {
    return this.modalController.dismiss(null, 'cancel');
  }

  close() {
    return this.modalController.dismiss(null, 'cancel');
  }
}
