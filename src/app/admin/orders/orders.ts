import { Component, computed, inject, signal } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { OrderList } from '../../models/order-list.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe,DatePipe } from '@angular/common';
import { Category } from '../../services/category.service';
import { CategoryDto } from '../../models/category.model';
import { OrderDetails } from '../../models/orderdetails-model';


declare var bootstrap: any;

@Component({
  selector: 'app-orders',
  standalone:true,
  imports: [ReactiveFormsModule,FormsModule,CurrencyPipe,DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  private orderService = inject(OrderService);
  private categoryService = inject(Category);
  public baseImageUrl = environment.imageBaseUrl; 
  readonly isLoading = signal(false);
  readonly errorMessages = signal<string[]>([]);
  orders = signal<OrderList[]>([]);
  selectedOrder = signal<OrderDetails|null>(null);
  categories = signal<CategoryDto[]>([]);
  selectedStatus = signal<string|''|'pending'|'confirmed'|'shipped'|'cancelled'>('');
  pageSize =5;
  currentPage =signal(1);
  searchQuery =signal('');
  fromDate =signal('');
  toDate =signal('');
  newOrderStatus =signal<string|''>('Processing');
  private modal:any;

  loadCategory(){
    this.categoryService.getCategory().subscribe({
      next:cats=>{
        this.categories.set(cats);
      }
    })
  }

  loadOrders(){
    this.isLoading.set(true);
    this.orderService.getAllOrder().subscribe({
      next:(orders)=>{
        this.isLoading.set(false);
        this.orders.set(orders);
      },error:(err)=>{
        console.log(err);
      }
    })
  }

  filterProduct = computed(()=>{
    let list = this.orders();
    if(this.searchQuery()){
      const query = this.searchQuery().toLowerCase();
      list = list.filter(p=>p.orderNo.toLowerCase().includes(query) || p.orderBy.toLowerCase().includes(query)); 
    }
    if (this.fromDate()) {
      const from = new Date(this.fromDate());
      from.setHours(0, 0, 0, 0);
      list = list.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= from;
      });
    }
    if (this.toDate()) {
      const to = new Date(this.toDate());
      to.setHours(23, 59, 59, 999);
      list = list.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate <= to;
      });
    }
    if(this.selectedStatus()){
      list = list.filter(p=>p.status.toLowerCase() === this.selectedStatus().toLowerCase());
    }
    return list;
  });

  paginatedOrders = computed(()=>{
    const startIndex =(this.currentPage()-1)*this.pageSize;
    return this.filterProduct().slice(startIndex,startIndex+this.pageSize);
  });

  totalPages = computed(() => {
    return Math.ceil(this.filterProduct().length / this.pageSize);
  });

  openOrderModal(model:OrderList){
    this.orderService.getOrderDetails(model.orderId).subscribe({
      next:(order)=>{
        this.selectedOrder.set(order);
      }
    })
    this.openModal();
  }
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
  updateOrderStatus() {
    const order = this.selectedOrder();
    if (!order || !this.newOrderStatus()) {
      return;
    }
    this.orderService.updateOrderStatus(order.orderId, this.newOrderStatus()).subscribe({
      next: (response: any) => {
        this.loadOrders();
        alert(response.message);
        this.closeModal();
      },
      error: err => {
        console.log(err);
        alert(
          err.error?.message ||
          'Failed to update order status.'
        );
      }
    });
  }
  ngOnInit(){
    this.loadOrders();
  }

  ngAfterViewInit(){
    const element = document.getElementById('orderModal');
    if (element) {
      this.modal = new bootstrap.Modal(element);
    }
  }

  resetPage() {
    this.currentPage.set(1);
  }
  
  openModal() {
      if (this.modal) {
          this.modal.show();
      }
  }

  closeModal() {
      if (this.modal) {
          this.modal.hide();
      }
  }
  removeFocus(event: Event) {
    (event.currentTarget as HTMLElement).blur();
  }
}
