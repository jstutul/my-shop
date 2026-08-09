import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxLoadingBar } from "@ngx-loading-bar/core";
import { AccountService } from './services/account.service';
@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, NgxLoadingBar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  private accountService = inject(AccountService);
  constructor() {
    this.accountService.restoreUser();
  }
  protected readonly title = signal('my-shop');
}
