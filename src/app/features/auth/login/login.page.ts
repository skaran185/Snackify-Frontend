import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService, private router: Router
  ) {
    // Initialize the form with validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Email is required and should match email format
      password: ['', [Validators.required, Validators.minLength(6)]]  // Password is required with min length of 6
    });
  }


  login() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      this.authService.login(credentials).subscribe(
        (response) => {
          this.authService.setCurrentUser(response);
          const userRole = this.authService.getUserRole();
  
          if (userRole === 'Admin') {
            this.router.navigate(['/admin']);
          } else if (userRole === 'RestaurantOwner') {
            this.router.navigate(['/owner']);
          } else {
            this.router.navigate(['/tabs/food']);
          }
        },
        (error) => {
          console.error('Login failed', error);
        }
      );
    } else {
      this.loginForm.markAllAsTouched(); // Marks all fields as touched
    }
  }
  

  // Getters for form controls to access errors easily in the template
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
