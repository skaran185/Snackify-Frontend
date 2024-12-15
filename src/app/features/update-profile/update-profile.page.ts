import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/core/services/toast.services';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.page.html',
  styleUrls: ['./update-profile.page.scss'],
})
export class UpdateProfilePage {

  userForm: FormGroup;
  userId: any;

  constructor(private userService: UserService,
    private modalController: ModalController,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastrService: ToastService
  ) {

    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
    });

    this.loadUserProfile();
  }

  // Load current user data to pre-fill fields
  loadUserProfile() {
    debugger
    let user = this.authService.getUser();
    const userProfileData = {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber
    };
    this.userId = user.UserID;
    this.userForm.setValue(userProfileData);
  }

  // Function to update user profile
  updateProfile() {
    const user: any = {
      ...this.userForm.value,
      userId: this.userId
    };

    this.userService.updateUser(user).subscribe(response => {
      if (response && response.name) {
        alert('Profile updated successfully!');
        this.toastrService.presentSuccessToast(response);
        this.authService.setUser(response);
      } else {
        alert('Error updating profile');
      }
    });
  }

  // Function to cancel the update
  cancel() {
    this.modalController.dismiss();
  }
}
