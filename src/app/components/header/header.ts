import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { CartService } from '../../services/cart.service';
import { AuthState } from '../../states/auth-state';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-header',
  standalone:true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  cartService = inject(CartService);
  readonly authState = inject(AuthState);
  private accountService = inject(AccountService);
  private router = inject(Router);
  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/login');
  }
}
