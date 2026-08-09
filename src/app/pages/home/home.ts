import { Component, inject, signal } from '@angular/core';
import { Category } from '../../services/category.service';
import { CategoryDto } from '../../models/category.model';
import { RouterLink } from "@angular/router";
import { ProductService } from '../../services/product.service';
import { CurrencyPipe } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { ProductDto } from '../../models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  standalone:true,
  imports: [RouterLink,CurrencyPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private categoryService = inject(Category);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  
  categories = signal<CategoryDto[]>([]);
  products = this.productService.featuredProducts; 
  isLoading = signal(true); 
  public baseImageUrl = environment.imageBaseUrl; 
  constructor(){
    this.categoryService.getCategory().subscribe({
      next:(cat:CategoryDto[])=>{
        this.categories.set(cat);
        this.isLoading.set(false);
      }
    });
    this.productService.getFeaturedProducts().subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false)
    });
  }
  ngOnInit(){
    
  }
  addToCart(product: ProductDto) {
    console.log(product);
    this.cartService.addToCart(product);
  }
}
