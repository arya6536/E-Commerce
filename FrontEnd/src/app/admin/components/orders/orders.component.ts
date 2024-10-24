import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatMenu,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatCardSubtitle,
    MatMenuTrigger
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: any[] = []; // Adjust type according to your DTO

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getPlacedOrders();
  }

  getPlacedOrders() {
    this.adminService.getPlacedOrders().subscribe(res => {
      this.orders = res; // Assuming response is an array
    });
  }

  changeOrderStatus(orderId: number, status: string) {
    this.adminService.changeOrderStatus(orderId, status).subscribe(res => {
      if (res && res.id != null) {
        this.snackBar.open('Order Status changed Successfully!', 'Close', { duration: 5000 });
        const updatedOrder = this.orders.find(order => order.id === orderId);
        if (updatedOrder) {
          updatedOrder.orderStatus = status;
        }
      } else {
        this.snackBar.open('Something went wrong', 'Close', { duration: 5000 });
      }
    }, error => {
      this.snackBar.open('Error updating order status', 'Close', { duration: 5000 });
      console.error('Error details:', error);
    });
  }
  
}
