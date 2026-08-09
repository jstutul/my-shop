import { Component, inject, signal } from '@angular/core';
import { LoginDto } from '../../models/login.model';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule,Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private formBuilder = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  readonly isLoading = signal(false);
  readonly errorMessages = signal<string[]>([]);
  
  loginForm = this.formBuilder.group({
    username: ['',Validators.required],
    password: ['',Validators.required],
  });

  login(){
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessages.set([]);
    this.accountService.login(this.loginForm.value as LoginDto).subscribe({
      next:()=>{
        this.isLoading.set(false);
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.isLoading.set(false);
          const message =
          err?.error?.message ??
          err?.message ??
          'An unexpected error occurred.';

        this.errorMessages.set([message]);
      }
    });
  }
}
