import { inject, Injectable } from '@angular/core';
import { String } from '../string/string.enum';
import { LoginDto } from '../models/login.model';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { AuthState } from '../states/auth-state';
import { Observable, tap } from 'rxjs';
import { ProfileUpdateDto } from '../models/profileUpdate.model';
import { AddressDto } from '../models/address.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private authService = inject(AuthService);
  private authState = inject(AuthState)

  updateProfile(model:ProfileUpdateDto){
    return this.authService.updateProfileUser(model).pipe(
      tap(response=>{
        this.authState.updateUser({
          firstName: model.firstName!,
          lastName: model.lastName!,
          emailAddress: model.emailAddress!,
          phoneNo: model.phoneNo!
        });
      })
    )
  }
  login(model:LoginDto){
    return this.authService.login(model).pipe(
      tap(response=>{
        console.log('Login response:', response);
        this.saveToken(response.jwt);
        this.saveUser(response.user);
        this.authState.setUser(response.user);
      })
    );
  }


  // token service to save the token in local storage
  saveToken(token: string) {
    localStorage.setItem(String.USER_TOKEN, token);
  }

  clear() {
    localStorage.removeItem(String.USER_TOKEN);
  }

  getToken(){
    return localStorage.getItem(String.USER_TOKEN);
  }
  // storage service to get the token from local storage
  saveUser(user: User) {
    localStorage.setItem(String.USER_KEY, JSON.stringify(user));
  }
  getuser(): User | null {
    const user = localStorage.getItem(String.USER_KEY);
    return user? JSON.parse(user) : null;
  }

  restoreUser():void{
    const user= localStorage.getItem(String.USER_KEY);
    if(user){
      this.authState.setUser(JSON.parse(user));
    }
  }
  logout() {
    localStorage.removeItem(String.USER_KEY);
    localStorage.removeItem(String.USER_TOKEN);
    this.authState.clear();
  }
  getAddressList(): Observable<AddressDto[]>
  {
    return this.authService.getAddressed();
  }

  addAddress(model:AddressDto){
    return this.authService.addAddress(model);
  }
  updateAddress(id:number,model:AddressDto){
    return this.authService.updateAddress(id,model);
  }
  deleteAddress(id:number){
    return this.authService.deleteAddresss(id);
  }
  makeDefaultAddress(id:number){
    console.log(id);
    return this.authService.makeDefaultAddress(id);
  }
}
