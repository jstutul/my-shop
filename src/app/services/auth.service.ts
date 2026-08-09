import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginDto } from '../models/login.model';
import { AuthResponse } from '../models/auth-response.model';
import { RegisterDto } from '../models/register.model';
import { Observable, tap } from 'rxjs';
import { Profile } from '../models/profile.model';
import { User } from '../models/user.model';
import { ProfileUpdateDto } from '../models/profileUpdate.model';
import { AddressDto } from '../models/address.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  constructor() {}

  updateProfileUser(model:ProfileUpdateDto){
    return this.http.post(this.baseUrl+'account/profile-update',model);
  }
  login(model:LoginDto):Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.baseUrl + 'account/login', model);
  }

  register(model:RegisterDto):Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.baseUrl + 'account/register', model);
  }

  logout(refreshToken:string):Observable<void> {
    return this.http.post<void>(this.baseUrl + 'account/logout', { refreshToken });
  }

  getCurrentUser(){
    return this.http.get(`${this.baseUrl}account/me`);
  }
  getAddressed(){
    return this.http.get<AddressDto[]>(this.baseUrl+'account/addresses');
  }
  addAddress(model:AddressDto){
    return this.http.post(this.baseUrl+'account/address',model);
  }
  updateAddress(id:number,model:AddressDto){
    return this.http.put(this.baseUrl+'account/address/'+id,model);
  }
  deleteAddresss(id:number){
    return this.http.delete(this.baseUrl+'account/address/'+id);
  }
  makeDefaultAddress(id:number){
    return this.http.put(this.baseUrl+'account/address/default/'+id,{});
  }
}

