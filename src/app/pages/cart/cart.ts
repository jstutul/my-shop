import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment.development';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from "@angular/router";
@Component({
  selector: 'app-cart',
  standalone:true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  cartService = inject(CartService);
  public baseImageUrl = environment.imageBaseUrl; 
}
