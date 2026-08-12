import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { StockResponse } from '../../models/stock.model';
import { ProductDto } from '../../models/product.model';
declare var bootstrap: any;
@Component({
  selector: 'app-stock',
  imports: [ReactiveFormsModule,FormsModule],
  templateUrl: './stock.html',
  styleUrl: './stock.css',
})
export class Stock {
  private formBuilder  = inject(FormBuilder);
  private stockService = inject(ProductService);
  products = signal<ProductDto[]>([]);

  searchQuery = signal<string>('');
  isDropdownOpen = signal<boolean>(false);
  
  filteredproducts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return [];
    return this.products().filter(product => 
      product.name.toLowerCase().includes(query)
    );
  });

  // 4. Select an item
  selectProduct(product: ProductDto) {
    this.searchQuery.set(product.name);
    this.stockForm.patchValue({
      productId: product.id.toString()
    });
    this.isDropdownOpen.set(false);
  }
  onProductSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    // Clear previously selected product
    this.stockForm.patchValue({
      productId: ''
    });
    this.isDropdownOpen.set(true);
  }
  onBlur() {
    setTimeout(() => {
      this.isDropdownOpen.set(false);
    }, 200);
  }
  
  stocks = signal<StockResponse[]>([]);
  stockType = signal<string>('in');
  pageSize =10;
  currentPage =signal(1);
  private modal:any;

  stockForm = this.formBuilder.group({
    productId: ['', Validators.required],
    quantity: [10, Validators.required]
  });
  paginatedStock = computed(()=>{
    const startIndex =(this.currentPage()-1)*this.pageSize;
    return this.stocks().slice(startIndex,startIndex+this.pageSize);
  });
  

  totalPages = computed(() => {
    return Math.ceil(this.stocks().length / this.pageSize);
  });

  saveStock(){
    if(this.stockForm.invalid){
      this.stockForm.markAllAsTouched();
      return;
    }

    if(this.stockType()==="out"){
      this.stockService.removeStock(this.stockForm.value).subscribe({
        next:(stock:any)=>{
          this.loadStockList();
          this.closeModal();
          alert(stock.message);
        }
      })
    }else{
      this.stockService.addStock(this.stockForm.value).subscribe({
        next:(stock:any)=>{
          this.loadStockList();
          this.closeModal();
          alert(stock.message);
        }
      })
    }
  }

  openAddStock(type:string){
    this.stockType.set(type);
    this.searchQuery.set('');
    this.stockForm.reset({
      productId: "0",
      quantity: 0
    });
    this.openModal();
  }

  loadStockList(){
    this.stockService.getStockList().subscribe({
      next:(stocks)=>{
        this.stocks.set(stocks);
      }
    })
  }
  loadProducts() {
    this.stockService.getProductList().subscribe({
      next: products => {
        this.products.set(products);
      }
    });
  }
  ngOnInit(){
    this.loadStockList();
    this.loadProducts();
  }

  ngAfterViewInit(){
    const element = document.getElementById('customerModal');
    if (element) {
      this.modal = new bootstrap.Modal(element);
    }
  }
  resetPage() {
    this.currentPage.set(1);
  }
  openModal() { this.modal.show(); }
  closeModal() { this.modal.hide(); }
}
