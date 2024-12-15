import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Role } from 'src/app/core/interface/role.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { RoleService } from 'src/app/core/services/role.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  user = {
    name: '',
    email: '',
    password: '',
    roleId: '',
    phoneNumber: ''
  };
  roles: Role[] = [];
  registerForm: FormGroup;

  constructor(private authService: AuthService, private router: Router,
    private roleService: RoleService,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],  // Name is required
      email: ['', [Validators.required, Validators.email]],  // Email is required and should be in a valid format
      password: ['', [Validators.required, Validators.minLength(6)]],  // Password is required with min length of 6
      roleId: ['', Validators.required],  // Role is required
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]  // Phone number is required and should be a 10-digit number
    });
  }

  ngOnInit() {
    this.roleService.getRoles().subscribe((roles: Role[]) => {
      this.roles = roles;
    });
  }

  register() {
    if (this.registerForm.valid) {
      const payload = this.registerForm.value;
      this.authService.register(payload).subscribe(
        (response) => {
          this.router.navigate(['/auth/login']);
        },
        (error) => {
          console.error('Registration failed', error);
        }
      );
    } else {
      this.registerForm.markAllAsTouched(); // Marks all fields as touched
    }
  }

  // Getters for form controls to easily access validation errors in the template
  get name() {
    return this.registerForm.get('name');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get roleId() {
    return this.registerForm.get('roleId');
  }

  get phoneNumber() {
    return this.registerForm.get('phoneNumber');
  }
}
