import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { OrderState } from '../states/order-state';
import { tap } from 'rxjs';
import { OrderList } from '../models/order-list.model';
import { OrderDetails } from '../models/orderdetails-model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private orderState = inject(OrderState);
  private baseUrl = environment.apiUrl;

  createOrder(orderData: any) {
    return this.http.post(`${this.baseUrl}order/place-order`, orderData);
  }
  verify(sesion_id:string){
    return this.http.get(`${this.baseUrl}order/verify-order?sessionId=${sesion_id}`);
  }

  getOrderList() {
    return this.http
      .post<OrderList[]>(this.baseUrl + 'order/my-orders', {})
      .pipe(
        tap(orders => {
          this.orderState.setOrder(orders);
        })
      );
  }

  getAllOrder(){
    return this.http.post<OrderList[]>(this.baseUrl+'order/all-orders',{});
  }
  getOrderDetails(id: number) {
    return this.http.get<OrderDetails>(this.baseUrl+'order/order-details/'+id);
  }

  updateOrderStatus(id: number, status: string) {
    return this.http.put(
      `${this.baseUrl}order/update-status/${id}`,
      {
        status: status
      }
    );
  }
}

