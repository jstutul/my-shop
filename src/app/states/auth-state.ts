import { computed, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { String } from '../string/string.enum';
import { AddressDto } from '../models/address.model';

@Injectable({
  providedIn: 'root',
})
export class AuthState {
  // private writeable signal to hold the current user state
  private _currentUser = signal<User|null>(null);
  // public readonly signal to expose the current user state
  readonly currentUser = this._currentUser.asReadonly();
  // public readonly signal to indicate if the user is logged in
  readonly isLoggedIn = computed(()=> this._currentUser() !== null);
  // public user role signal to expose the current user's roles
  readonly roles =computed(()=> this._currentUser()?.roles || []);
  // public readonly signal to indicate if the user is an admin
  readonly isAdmin = computed(()=> this.roles().includes('Admin'));
  // public readonly signal to get the full name of the current user
  readonly fullName = computed(()=> {
    const user = this._currentUser();
    if(!user)
    {
      return '';
    }
    return `${user.firstName} ${user.lastName}`;
  });
  // method to get roles

  // method to set the current user state
  setUser(user:User):void{
    this._currentUser.set(user);
  }
  // method to update the current user state with partial user data
  updateUser(user:Partial<User>):void{
    this._currentUser.update(current=>{
      if(!current) return null;
      const updatedUser = { ...current, ...user };
      localStorage.setItem(String.USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
    })
  }
  // method to clear the current user state
  clear():void{
    this._currentUser.set(null);
  }

}
