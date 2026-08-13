import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  
  getDashboardData(){
    return this.http.post<any>(this.baseUrl+'report/dashboard',{});
  }
}
