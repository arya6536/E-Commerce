import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../../service/admin.service';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-post-category',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    MatLabel,
    MatError,
    NgIf,
    RouterLink
  ],
  templateUrl: './post-category.component.html',
  styleUrls: ['./post-category.component.scss']  // Fixed typo
})
export class PostCategoryComponent {

  categoryForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });
  }

  addCategory(): void {
    if (this.categoryForm.valid) {
      console.log('Form data:', this.categoryForm.value); // Debugging
      this.adminService.addCategory(this.categoryForm.value).subscribe(
        (res) => {
          console.log('Response:', res); // Debugging
          if (res.id != null) {
            this.snackBar.open('Category Posted Successfully !!', 'Close', { duration: 5000 });
            this.router.navigateByUrl('/admin/dashboard');
          } else {
            this.snackBar.open(res.message, 'Close', {
              duration: 5000,
              panelClass: 'error-snackbar'
            });
          }
        },
        (error) => {
          console.error('Error:', error); // Debugging
          this.snackBar.open('Failed to add category', 'Close', { duration: 5000 });
        }
      );
    } else {
      this.categoryForm.markAllAsTouched();
      console.log('Form is invalid');
    }
  }
}
