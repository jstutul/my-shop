import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Category } from '../../services/category.service';
import { CategoryDto } from '../../models/category.model';
import { environment } from '../../../environments/environment.development';
import { ProductDto } from '../../models/product.model';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-shop',
  imports: [RouterLink,CurrencyPipe,FormsModule],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop {
  private categoryService = inject(Category);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);

  categories = signal<CategoryDto[]>([]);
  allproducts = signal<ProductDto[]>([]);
  isLoading = signal(true); 
  viewMode = signal<'grid' | 'list'>('grid');
  public baseImageUrl = environment.imageBaseUrl; 

  searchQuery =signal('');
  selectedCategory = signal<number|null>(null);
  sortOrder=signal<'low-to-high'|'high-to-low'>('low-to-high')
  maxPrice =signal<number>(1000);
  
  addToCart(product: ProductDto) {
    this.cartService.addToCart(product);
  }
  filterProduct = computed(()=>{
    let list = this.allproducts();
    if(this.searchQuery()){
      const query = this.searchQuery().toLowerCase();
      list = list.filter(p=>p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)); 
    }
   
    if(this.selectedCategory()){
      list = list.filter(p=>Number(p.categoryId) === this.selectedCategory());
    }

    list = [...list].sort((a,b)=>{
      return this.sortOrder() === 'low-to-high' ? a.price-b.price:b.price-a.price;
    });
    
    const max = this.maxPrice();
    list = list.filter(p => p.price <= max);
    return list;
  });

  currentPage =signal(1);
  pageSize =9;

  paginatedProducts = computed(()=>{
    const startIndex =(this.currentPage()-1)*this.pageSize;
    return this.filterProduct().slice(startIndex,startIndex+this.pageSize);
  })




  ngOnInit(){
    this.categoryService.getCategory().subscribe(cats => this.categories.set(cats));
    this.productService.getProductList().subscribe({
      next: (prods) => {
        this.allproducts.set(prods);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });

    this.route.queryParams.subscribe(params => {
      const categoryId = params['cat'];
      if(categoryId){
        this.selectedCategory.set(categoryId);
      }
    });
  }
  resetPage() {
    this.currentPage.set(1);
  }

  onPriceChange(event:Event){
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    this.maxPrice.set(value);
  }
  setViewMode(mode: 'grid' | 'list') {
    this.viewMode.set(mode);
  }

}
