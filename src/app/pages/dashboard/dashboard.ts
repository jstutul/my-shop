import { Component, inject, signal } from '@angular/core';
import { AuthState } from '../../states/auth-state';
import { DashboardService } from '../../services/dashboard.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports: [CurrencyPipe,DatePipe,RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  public userState = inject(AuthState);
  private dashboardservice = inject(DashboardService);
  public data=signal<any|null>(null);
  getStatusClass(status?: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'badge rounded-pill px-3 py-2 bg-warning text-dark';
      case 'confirmed':
        return 'badge rounded-pill px-3 py-2 bg-info text-dark';
      case 'processing':
        return 'badge rounded-pill px-3 py-2 bg-primary';
      case 'shipped':
        return 'badge rounded-pill px-3 py-2 bg-secondary';
      case 'delivered':
        return 'badge rounded-pill px-3 py-2 bg-success';
      case 'cancelled':
        return 'badge rounded-pill px-3 py-2 bg-danger';
      default:
        return 'badge rounded-pill px-3 py-2 bg-light text-dark';
    }
  }
  ngOnInit(){
    this.dashboardservice.getDashboardData().subscribe({
      next:(response)=>{
        this.data.set(response);
        console.log(this.data());
      }
    })

  }
  logout(){
    
  }
}
