import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { CommonModule, NgClass, NgFor } from '@angular/common';


@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [NgFor,
    NgClass,
    CommonModule
  ],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss'
})
export class MyOrdersComponent {
  myOrders: any;

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.getMyOrders();
  }

  getMyOrders() {
    this.customerService.getOrdersByUserId().subscribe(res => {
      this.myOrders = res;
    });
  }
}
