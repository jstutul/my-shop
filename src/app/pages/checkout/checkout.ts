import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment.development';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  private orderService = inject(OrderService);
  private router = inject(Router);
  public baseImageUrl = environment.imageBaseUrl; 
  
  cartService = inject(CartService);
  isProcessing=signal(false);
  customer ={
    fullName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'CreditCard',
  }

  get items(){return this.cartService.items();}
  get total(){return this.cartService.totalPrice();}

  ngOnInit() {
    if(this.items.length === 0) {
      this.router.navigate(['/']);
    }
  }
  async processOrder(){
    if(this.customer.fullName && this.customer.email && this.customer.address && this.customer.city && this.customer.zipCode){
      this.isProcessing.set(true);
      const orderData = {
        ...this.customer,
        items:this.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
      }
      await this.orderService.createOrder(orderData).subscribe({
        next: (order: any) => {
          console.log('Order created successfully:', order);
          // this.cartService.clearCart();
          this.isProcessing.set(false);
           window.location.href = order.checkoutUrl;
        },
        error: (error) => {
          console.error('Error creating order:', error);
          this.isProcessing.set(false);
        }
      });
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
