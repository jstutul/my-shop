import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [],
  templateUrl: './success.html',
  styleUrl: './success.css',
})
export class Success {
  private route = inject(ActivatedRoute);
  orderId: string | null = null;
  constructor() {
    this.orderId = this.route.snapshot.paramMap.get('id');
  }
}
