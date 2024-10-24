import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIcon,
    NgIf,
    MatFormField,
    MatLabel,
    MatOption,
    MatError,
    MatSelect,
    NgFor,
    MatInput,
    RouterLink,
  ],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss'
})
export class UpdateProductComponent {
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  listOfCategories: any = [];
  existingImg: string | null = null;
  productForm!: FormGroup;
  productId: string;
  imgChanged = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private activatedroute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Initialize productId in ngOnInit
    this.productId = this.activatedroute.snapshot.params['productId'];

    // Initialize the form
    this.productForm = this.fb.group({
      categoryId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });

    // Fetch categories and product details
    this.getAllCategories();
    this.getProductById();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.previewImage();
    this.imgChanged = true;

    this.existingImg = null;
  }

  previewImage(): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.selectedFile!);
  }

  getAllCategories(): void {
    this.adminService.getAllCategories().subscribe(res => {
      this.listOfCategories = res;
    });
  }

  getProductById(): void {
    this.adminService.getProductById(this.productId).subscribe(res => {
      this.productForm.patchValue(res);
      this.existingImg = 'data:image/jpeg;base64,' + res.byteImg;
    });
  }

  updateProduct(): void {
    if (this.productForm.valid) {
      const formData: FormData = new FormData();

      if(this.imgChanged && this.selectedFile){
        formData.append('img', this.selectedFile!);
      }
      
      formData.append('CategoryId', this.productForm.get('categoryId')?.value);
      formData.append('name', this.productForm.get('name')?.value);
      formData.append('description', this.productForm.get('description')?.value);
      formData.append('price', this.productForm.get('price')?.value);

      this.adminService.updateProduct(this.productId, formData).subscribe((res) => {
        if (res.id != null) {
          this.snackBar.open('Product updated successfully', 'Close', {
            duration: 5000
          });
          this.router.navigateByUrl('/admin/dashboard');
        } else {
          this.snackBar.open(res.message, 'ERROR', {
            duration: 5000
          });
        }
      });
    } else {
      for (const control in this.productForm.controls) {
        if (this.productForm.controls.hasOwnProperty(control)) {
          this.productForm.controls[control].markAsDirty();
          this.productForm.controls[control].updateValueAndValidity();
        }
      }
    }
  }
}
