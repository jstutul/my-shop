import { Component, inject } from '@angular/core';
import { AuthState } from '../../states/auth-state';

@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  public userState = inject(AuthState);

  logout(){
    
  }
}
