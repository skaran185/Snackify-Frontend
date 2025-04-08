import { Component, Input, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-menu-navigation',
  templateUrl: './menu-navigation.component.html',
  styleUrls: ['./menu-navigation.component.scss']
})
export class MenuNavigationComponent implements AfterViewInit {
  @ViewChild(IonContent, { static: true }) content!: IonContent;
  @Input() categories: any[] = [];
  @Output() categorySelected = new EventEmitter<string>();
  showCategories = false;

  constructor() {}

  ngAfterViewInit() {
    if (!this.content) {
      console.error('IonContent is not available after view initialization');
    }
  }

  toggleCategoryList() {
    this.showCategories = !this.showCategories;
  }

  selectCategory(categoryId: string) {
    this.categorySelected.emit(categoryId);
    this.showCategories = false;
  }
}
