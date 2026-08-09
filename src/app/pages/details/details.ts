import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductDto } from '../../models/product.model';
import { environment } from '../../../environments/environment.development';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [RouterLink,CurrencyPipe],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit  {
  private route = inject(ActivatedRoute); // Used to get the ID from URL
  private productService = inject(ProductService);
  cartService = inject(CartService);
  product = signal<ProductDto | null>(null);
  semilerProduct = signal<ProductDto[]>([]);
  isLoading = signal(true);
  quantity = signal<number>(1);
  public baseImageUrl = environment.imageBaseUrl; 
  constructor(){
    
  }

  incrementQty(){
    this.quantity.update(q=>q<10?q+1:q)
  }
  decrementQty(){
    this.quantity.update(q=>q>1?q-1:q)
  }
  syncCart(){
    const prod = this.product();
    if (prod) {
      this.cartService.setQuantity(prod.id, this.quantity());
    }
  }
  cartQuantity = computed(()=>{
    const currentProduct = this.product();
    if (!currentProduct) return 0;
    const itemInCart = this.cartService.items().find(item => item.productId === currentProduct.id);
    return itemInCart ? itemInCart.quantity : 0;
  })

  loadProductData(id:number){
      this.productService.getProductById(id).pipe(
        switchMap(data =>{
          this.product.set(data);
          const inCart = this.cartService.items().find(item => item.productId === data.id);
          // if (inCart) {
          //   this.quantity.set(inCart.quantity);
          // }
          return this.productService.getProductList();
        })
      ).subscribe({
        next:(products)=>{
          const currentProd = this.product();
          if(currentProd){
            const filtered = products.filter(p => 
            Number(p.categoryId) === Number(currentProd.categoryId) && 
            p.id !== currentProd.id
          );
          this.semilerProduct.set(filtered.slice(0, 4));
            this.isLoading.set(false);
          }
        }
      })
  }
  ngOnInit(){
    this.route.paramMap.subscribe(params=>{
      const productId =params.get('id');
      if(productId){
        this.loadProductData(parseInt(productId));
      }
    })
  }
  onQuantityChange(event: Event) {
    const value = Number((event.target as HTMLInputElement).value);
    this.quantity.set(
      Math.max(1, Math.min(value || 1, 10))
    );
  }
  addToCart(){
    const product = this.product();
    if(product){
      this.cartService.addToCart(product,this.quantity());
    }
  }

}
