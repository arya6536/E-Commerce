import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { PlaceOrderComponent } from '../place-order/place-order.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgTemplateOutlet,
    MatIcon,
    NgClass,
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartItems: any[] = [];
  order: any;

  constructor(
    private customerService: CustomerService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public dialog: MatDialog,
  ){}

  ngOnInit(): void {
    this.getCart();
  }

  getCart(): void {
    this.customerService.getCartByUserId().subscribe(
      res => {
        // Check if the response contains cart items
        if (res && res.cartItems) {
          this.order = res;

          // Process the cart items
          this.cartItems = res.cartItems.map((item: any) => {
            item.processedImg = 'data:image/jpeg;base64,' + item.returnedImg;
            return item;
          });
        } else {
          // If no cart items, clear the cart
          this.cartItems = [];
        }
      },
      error => {
        console.error('Error fetching cart:', error);
        this.snackBar.open('Failed to load cart items', 'Close', { duration: 3000 });
      }
    );
  }


  increaseQuantity(productId: any) {
    this.customerService.increaseProductQuantity(productId).subscribe(
      res => {
        this.snackBar.open('Product quantity increased', 'Close', { duration: 5000 });
        // Find the cart item and update the quantity locally
        const itemToUpdate = this.cartItems.find(item => item.productId === productId);
        if (itemToUpdate) {
          itemToUpdate.quantity += 1; // Increment the local quantity
        }
        // Update total amount if necessary
        this.order.totalAmount += itemToUpdate.price;
      },
      error => {
        this.snackBar.open('Failed to increase product quantity', 'Close', { duration: 5000 });
        console.error('Error increasing quantity:', error);
      }
    );
  }
  
  decreaseQuantity(productId: any) {
    this.customerService.increaseProductQuantity(productId).subscribe(
      res => {
        this.snackBar.open('Product quantity decreased', 'Close', { duration: 5000 });
        // Find the cart item and update the quantity locally
        const itemToUpdate = this.cartItems.find(item => item.productId === productId);
        if (itemToUpdate) {
          itemToUpdate.quantity -= 1; // Increment the local quantity
        }
        // Update total amount if necessary
        this.order.totalAmount -= itemToUpdate.price;
      },
      error => {
        this.snackBar.open('Failed to increase product quantity', 'Close', { duration: 5000 });
        console.error('Error increasing quantity:', error);
      }
    );
  }
  placeOrder(){
    this.dialog.open(PlaceOrderComponent);
  }
}
