import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment.development';
import { CurrencyPipe } from '@angular/common';
import { AddressDto } from '../../models/address.model';
import { AccountService } from '../../services/account.service';
import { AuthState } from '../../states/auth-state';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  private orderService = inject(OrderService);
  public userState = inject(AuthState);
  private accountService = inject(AccountService);
  private router = inject(Router);
  public baseImageUrl = environment.imageBaseUrl; 
  cartService = inject(CartService);
  isProcessing=signal(false);
  customer ={
    fullName: this.userState.fullName(),
    email: this.userState.currentUser()?.emailAddress,
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'CreditCard',
  }

  get items(){return this.cartService.items();}
  get total(){return this.cartService.totalPrice();}

  ngOnInit() {
    this.accountService.getAddressList().subscribe({
      next:(address:AddressDto[])=>{
        address=address.filter(x=>x.isDefault==true);
        console.log(address[0]);
        this.customer.address=address[0].addressLine;
        this.customer.city=address[0].city;
        this.customer.zipCode=address[0].postalCode;
      },
      error:err=>{
        console.log(err);
      }
    })
    if(this.items.length === 0) {
      this.router.navigate(['/']);
    }
  }
  async processOrder(){
    if(this.customer.address && this.customer.city && this.customer.zipCode){
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
          this.cartService.clearCart();
          this.isProcessing.set(false);
           window.location.href = order.checkoutUrl;
        },
        error: (error) => {
          const message =
            error?.error?.message+'\n'+error?.error?.productName ||
            'Unable to place order. Please try again.';
          alert(message);
          this.isProcessing.set(false);
        }
        
      });
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
