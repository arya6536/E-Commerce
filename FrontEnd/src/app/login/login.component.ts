import { Component } from '@angular/core';
import { AppComponent } from "../app.component";
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule, MatLabel, MatError } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink, Routes } from '@angular/router';  // Corrected import
import { NgIf } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';  // Updated for server-side rendering
import { MatInputModule } from '@angular/material/input';
import { UserStorageService } from '../../services/storage/user-storage.service';
import { AdminComponent } from '../admin/admin.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    AppComponent,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatLabel,
    MatError,
    MatIconModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']  // Fixed typo
})

export class LoginComponent {

  loginForm!: FormGroup;
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router  // Corrected usage of Angular Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    const username = this.loginForm.get('email')!.value;
    const password = this.loginForm.get('password')!.value;
  
    this.authService.login(username, password).subscribe(
      (res) => {
        
        const user = UserStorageService.getUser(); // Get user data
      if (user) {
        const role = user.role; // Access the role property from user object
        if (role === 'ADMIN') {
          this.router.navigateByUrl('admin/dashboard');
        } else if (role === 'CUSTOMER') {
          this.router.navigateByUrl('customer/dashboard');
        } else {
          this.snackBar.open('User role not recognized', 'ERROR', { duration: 5000 });
        }
      } else {
        console.error('User data not retrieved from storage'); // Handle missing user data
        this.snackBar.open('Login unsuccessful', 'ERROR', { duration: 5000 });
      }
      },
      (error) => {
        console.error('Login Error:', error); // Log any errors
        this.snackBar.open('Bad credentials', 'ERROR', { duration: 5000 });
      }
    );
  }
  
  
}
