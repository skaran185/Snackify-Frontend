import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { MenuCategory } from 'src/app/core/interface/menuItem.interface';

@Component({
  selector: 'app-add-edit-category',
  templateUrl: './add-edit-category.component.html',
  styleUrls: ['./add-edit-category.component.scss'],
})
export class AddEditCategoryComponent  implements OnInit {
  @Input() category?: MenuCategory;
  categoryForm: FormGroup;
  isEditMode = false;
  
  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }
  
  ngOnInit() {
    if (this.category) {
      this.isEditMode = true;
      this.categoryForm.patchValue({
        name: this.category.name
      });
    }
  }
  
  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
  
  onSubmit() {
    if (this.categoryForm.valid) {
      this.modalCtrl.dismiss(this.categoryForm.value, 'save');
    }
  }
}
