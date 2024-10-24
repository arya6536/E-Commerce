import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-post-product',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatIcon,
    NgIf,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    NgFor,
    MatError,
    MatInput,
    RouterLink

  ],
  templateUrl: './post-product.component.html',
  styleUrl: './post-product.component.scss'
})
export class PostProductComponent {
selectedFile: File | null;
imagePreview: string | ArrayBuffer | null;
listOfCategories: any = [];

productForm!: FormGroup;

constructor(
  private fb : FormBuilder,
  private router: Router,
  private snackBar: MatSnackBar,
  private adminService: AdminService,
){}

onFileSelected(event: any){
  this.selectedFile = event.target.files[0];
  this.previewImage();
}

previewImage(){
  const reader = new FileReader();
  reader.onload = () =>{
    this.imagePreview = reader.result;
  }
  reader.readAsDataURL(this.selectedFile);
}

ngOnInit() : void{
  this.productForm = this.fb.group({
    categoryId: [null, [Validators.required]],
    name:[null,[Validators.required]],
    price:[null,[Validators.required]],
    description:[null,[Validators.required]],
  });
  this.getAllCategories();
}
getAllCategories(){
  this.adminService.getAllCategories().subscribe(res=>{
    this.listOfCategories = res;
  })
}
addProduct() : void{
  if(this.productForm.valid){
    const formData: FormData = new FormData();
    formData.append('img', this.selectedFile);
    formData.append('CategoryId',this.productForm.get('categoryId').value);
    formData.append('name', this.productForm.get('name').value);
    formData.append('description', this.productForm.get('description').value);
    formData.append('price',this.productForm.get('price').value);

    this.adminService.addProduct(formData).subscribe((res)=>{
      if(res.id!=null){
        this.snackBar.open('Product posted successfully','Close',{
          duration:5000
        });
        this.router.navigateByUrl('/admin/dashboard');
      }else{
        this.snackBar.open(res.message, 'ERROR',{
          duration:5000
        });
      }
    })
  }else{
    for(const i in this.productForm.controls){
      this.productForm.controls[i].markAsDirty();
      this.productForm.controls[i].updateValueAndValidity();
    }
  }

}
}
 