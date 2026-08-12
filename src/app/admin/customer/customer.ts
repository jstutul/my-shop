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
    email: ['',[Validators.required, Validators.email]],
    firstName :['',[Validators.required, Validators.minLength(3)]],
    lastName :['',[Validators.required, Validators.minLength(3)]],
    password : [''],
    phoneNo:['']
  });
  paginatedCustomer = computed(()=>{
    const startIndex =(this.currentPage()-1)*this.pageSize;
    return this.customers().slice(startIndex,startIndex+this.pageSize);
  });

  totalPages = computed(() => {
    return Math.ceil(this.customers().length / this.pageSize);
  });
  
  openEditCustomer(customer:Customer){
    this.editingCustomer.set(customer);
    this.customerForm.patchValue({
      email: customer.emailAddress,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phoneNo : customer.phoneNo
    });
    this.openModal();
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
    if (!this.editingCustomer() && !this.customerForm.get('password')?.value) {
      this.customerForm.get('password')?.setErrors({ required: true });
    }
    if(this.customerForm.invalid){
      this.customerForm.markAllAsTouched();
      return;
    }
    if(this.editingCustomer()){
      this.updateUser();
    }else{
      this.addUser();
    }
  }
  addUser(){
      this.customerService.addCustomer(this.customerForm.value as Customer).subscribe({
        next:(response:any)=>{
          alert(response.message);
          this.loadCustomer();
          this.closeModal();
        },error:(err)=>{
          console.log(err);
        }
      })
    }
  
    updateUser(){
      const id = this.editingCustomer()!.id;
      this.customerService.updateCustomer(id,this.customerForm.value as Customer).subscribe({
        next:(response:any)=>{
          this.loadCustomer();
          alert(response.message);
          this.closeModal();
        },error:(err)=>{
          console.log(err);
        }
      })
    }
  ngOnInit(){
    this.loadCustomer();
  }

  openAddCustomer(){
    this.editingCustomer.set(null);
    this.customerForm.reset({
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      phoneNo:'',
    });
    this.openModal();
  }
  ngAfterViewInit(){
    const element = document.getElementById('customerModal');
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
