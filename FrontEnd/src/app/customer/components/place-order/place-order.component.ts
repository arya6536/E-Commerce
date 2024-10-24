import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { MatInput, MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-place-order',
  standalone: true,
  imports: [ReactiveFormsModule,
    RouterLink,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatFormFieldModule,
    MatFormField,
    MatLabel,
    MatError,
    NgIf,
    MatInput,
    MatInputModule,
  ],
  templateUrl: './place-order.component.html',
  styleUrl: './place-order.component.scss'
})
export class PlaceOrderComponent {

  orderForm!: FormGroup;

  constructor(
    private fb : FormBuilder,
    private snackBar: MatSnackBar,
    private customerService: CustomerService,
    private router: Router,
    private dialog: MatDialog,

  ){}

  ngOnInit(){
    this.orderForm = this.fb.group({
      address:[null, [Validators.required]],
      orderDescription:[null],
    })
  }

  placeOrder() {
    if (this.orderForm.valid) {
      console.log("Submitting form", this.orderForm.value); // Debug log
      this.customerService.placeOrder(this.orderForm.value).subscribe({
        next: (res) => {
          console.log("Response from server:", res); // Debug log
          if (res.id != null) {
            this.snackBar.open("Order placed successfully", "Close", { duration: 5000 });
            this.router.navigateByUrl("/dashboard");
            this.closeForm();
          } else {
            this.snackBar.open("Something went wrong", "Close", { duration: 5000 });
          }
        },
        error: (error) => {
          console.error("Error occurred while placing the order:", error); // Error log
          this.snackBar.open("Failed to place the order. Please try again.", "Close", { duration: 5000 });
        }
      });
    } else {
      console.log("Form is invalid", this.orderForm); // Debug log for form validation
      this.snackBar.open("Please fill out the form correctly.", "Close", { duration: 5000 });
    }
  }
  
  

  closeForm(){
    this.dialog.closeAll();
  }
}
