import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-customer',
  standalone:true,
  imports: [RouterOutlet,Header,Footer],
  templateUrl: './customer.html',
  styleUrl: './customer.css',
})
export class Customer {}
