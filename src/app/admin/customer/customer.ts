import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
declare var bootstrap: any;
@Component({
  selector: 'app-customer',
  imports: [ReactiveFormsModule],
  templateUrl: './customer.html',
  styleUrl: './customer.css',
})
export class CustomerAdmin {
  private formBuilder = inject(FormBuilder);
  private customerService = inject(CustomerService);
  customers = signal<Customer[]>([]);
  editingCustomer = signal<Customer|null>(null);
  pageSize =10;
  currentPage =signal(1);
  private modal:any;
  customerForm = this.formBuilder.group({
    name: ['',Validators.required]
  });
  paginatedCustomer = computed(()=>{
    const startIndex =(this.currentPage()-1)*this.pageSize;
    return this.customers().slice(startIndex,startIndex+this.pageSize);
  });

  totalPages = computed(() => {
    return Math.ceil(this.customers().length / this.pageSize);
  });
  
  openEditCustomer(customer:Customer){

  }
  deleteCustomer(id:string){
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }
    this.customerService.deleteCustomer(id).subscribe({
      next: () => this.loadCustomer(),
      error: (err) => alert('Delete failed')
    });
  }
  loadCustomer(){
    this.customerService.getCustomers().subscribe({
      next:customers=>{
        this.customers.set(customers);
      }
    })
  }
  saveCustomer(){
    
  }
  ngOnInit(){
    this.loadCustomer();
  }

  openAddCustomer(){

  }
  ngAfterViewInit(){
    const element = document.getElementById('categoryModal');
    if (element) {
      this.modal = new bootstrap.Modal(element);
    }
  }
  resetPage() {
    this.currentPage.set(1);
  }
  openModal() { this.modal.show(); }
  closeModal() { this.modal.hide(); }
}
