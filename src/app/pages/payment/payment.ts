import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-payment',
  imports: [],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment {
  private route = inject(ActivatedRoute);
  private router=inject(Router);
  private orderService= inject(OrderService);
  private cartService = inject(CartService);
  isLoading = signal(true);
  paymentSuccess = signal(false);
  message = signal('');
  ngOnInit() {
  const sessionId = this.route.snapshot.queryParamMap.get('session_id');
  if (!sessionId) {
    return;
  }

  this.orderService.verify(sessionId)
      .subscribe({
        next: (res: any) => {
        this.isLoading.set(false);
        this.paymentSuccess.set(true);
        this.message.set('Payment completed successfully.');
        this.cartService.clearCart();
        setTimeout(() => {
            this.router.navigateByUrl('/');
          }, 3000);
        },
      error: (err) => {
        this.isLoading.set(false);
        this.paymentSuccess.set(false);

        this.message.set(
          err?.error?.message ??
          'Payment verification failed.'
        );
    }
  });
  }
}
