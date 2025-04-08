import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ProfileMenuPage } from 'src/app/features/profile-menu/profile-menu.page';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {

  constructor(private router: Router,
    private modalController: ModalController,
  ) { }
  currentPage: string = 'dashboard';

  ngOnInit(): void {

  }


  // Function to navigate to different pages
  async navigateTo(page: string) {
    this.currentPage = page
    this.router.navigate([`/owner/${page}`]);
  }

  async openProfile() {
    this.openModal(ProfileMenuPage);
  }

  async openModal(page: any) {
    const modal = await this.modalController.create({
      component: page,
      cssClass: 'profile-menu',
    });
    await modal.present();
  }
}
