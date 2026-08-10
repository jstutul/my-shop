import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl; 

  getCustomers(){
    return this.http.post<Customer[]>(this.baseUrl+'account/get-customers',{});
  }
  deleteCustomer(id:string){
    return this.http.delete(this.baseUrl+'account/get-customers');
  }
}
