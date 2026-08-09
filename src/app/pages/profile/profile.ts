import { Component, effect, inject, signal } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { single } from 'rxjs';
import { User } from '../../models/user.model';
import { AuthState } from '../../states/auth-state';
import { FormBuilder, Validators, ReactiveFormsModule  } from '@angular/forms';
import { ProfileUpdateDto } from '../../models/profileUpdate.model';
import { OrderService } from '../../services/order.service';
import { OrderState } from '../../states/order-state';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';
import { AddressDto } from '../../models/address.model';

declare var bootstrap: any;
@Component({
  selector: 'app-profile',
  standalone:true,
  imports: [ReactiveFormsModule,DatePipe,CurrencyPipe ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})

export class Profile {
  public userState = inject(AuthState);
  private accountService = inject(AccountService);
  private orderService = inject(OrderService);
  public orderState = inject(OrderState);
  private router = inject(Router);
  public baseImageUrl = environment.imageBaseUrl; 
  modal:any;
  addressList = signal<AddressDto[]>([]);
  activetab  = signal<'profile'|'orders'|'address'>('profile');
  editingAddress = signal<AddressDto | null>(null);


  private formBuilder = inject(FormBuilder);
  profile = this.formBuilder.group({
    firstName : [this.userState.currentUser()?.firstName,Validators.required],
    lastName:[this.userState.currentUser()?.lastName,Validators.required],
    emailAddress: [this.userState.currentUser()?.emailAddress,Validators.required],
    phoneNo : [this.userState.currentUser()?.phoneNo]
  });

  addressForm = this.formBuilder.group({
    addressLine: ['', Validators.required],
    city: ['', Validators.required],
    state: [''],
    postalCode: [''],
    isDefault: [false]
  });

  readonly isLoading = signal(false);
  readonly errorMessages = signal<string[]>([]);
  changeTab(tab:'profile'|'orders'|'address'){
    this.activetab.set(tab);
  }
  user = signal<User>;
  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/login');
  }
  update(){
    if(this.profile.invalid){
      this.profile.markAllAsTouched();
    }
    this.isLoading.set(true);
    this.errorMessages.set([]);
    this.accountService.updateProfile(this.profile.value as ProfileUpdateDto).subscribe({
      next:(result:any)=>{
        alert(result.message);
      },error:err=>{
        console.log(err);
      }
    })
  }
  constructor() {
    effect(() => {
      console.log(this.addressList());
    });
  }

  ngAfterViewInit(){
    const element = document.getElementById('addressModal');
    if (element) {
      this.modal = new bootstrap.Modal(element);
    }
  }

  // For Add new Address
  openAddAddress(){
    this.editingAddress.set(null);
    this.addressForm.reset({
      addressLine: '',
      city: '',
      state: '',
      postalCode: '',
      isDefault: false
    });
    this.openModal();
  }

  // For Edit Address
  openEditAddress(address:AddressDto){
    this.editingAddress.set(address);
    this.addressForm.patchValue({
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      isDefault: address.isDefault
    });
    this.openModal();
  } 
  
  saveAddress(){
    if(this.addressForm.invalid){
      this.addressForm.markAllAsTouched();
      return;
    }
    if(this.editingAddress()){
      this.updateAddress();
    }else{
      this.addAddress();
    }
  }

  addAddress(){
    this.accountService.addAddress(this.addressForm.value as AddressDto).subscribe({
      next:(response:any)=>{
        this.addressList.update(address=>[...address,response.address]);
        this.closeModal();
      },error:(err)=>{
        console.log(err);
      }
    })
  }

  updateAddress(){
    const id = this.editingAddress()!.id;
    this.accountService.updateAddress(id,this.addressForm.value as AddressDto).subscribe({
      next:(response:any)=>{
        const formValue = this.addressForm.getRawValue();
        const newAddress: AddressDto = {
          id: id,
          addressLine: formValue.addressLine!,
          city: formValue.city!,
          state: formValue.state ?? '',
          postalCode: formValue.postalCode ?? '',
          isDefault: formValue.isDefault ?? false
        };
        this.addressList.update(addresses =>addresses.map(address =>
          address.id === id ? newAddress : address
        ));
        alert(response.message);
        this.closeModal();
      },error:(err)=>{
        console.log(err);
      }
    })
  }

  makeDefaultAddress(id: number) {
    if (!confirm('Are you sure you want to default this address?')) {
      return;
    }
    this.accountService.makeDefaultAddress(id).subscribe({
      next:(response:any)=>{
        this.addressList.update(addresses =>
        addresses.map(address => ({
          ...address,
            isDefault: address.id === id
          }))
        );

        alert(response.message);
      },error:(err)=>{
        console.log(err);
      }
    })
  }

  deleteAddress(id:number){
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }
    this.accountService.deleteAddress(id).subscribe({
      next: (res: any) => {
        this.addressList.update(addresses =>
          addresses.filter(address => address.id !== id)
        );
        alert(res.message);
      },
      error: (errors) => {
        console.log(errors);
      }
    });
  }
  
  openModal() {
    this.modal.show();
  }

  closeModal() {
    this.modal.hide();
  }
  ngOnInit(){
    this.orderService.getOrderList().subscribe();
    this.accountService.getAddressList().subscribe({
      next:(address)=>{
        this.addressList.set(address);
      },
      error:err=>{
        console.log(err);
      }
    })
  }
}
