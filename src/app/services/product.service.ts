import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ProductDto } from '../models/product.model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { StockResponse } from '../models/stock.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl; 

  private _products =signal<ProductDto[]>([])
  private _fproducts =signal<ProductDto[]>([])
  products =this._products.asReadonly();
  featuredProducts = this._fproducts.asReadonly();
  getProductList():Observable<ProductDto[]>
  {
      // We use the generic <ProductDto[]> so the HTTP call is type-safe
    return this.http.get<ProductDto[]>(this.baseUrl+'product/get-products').pipe(
      tap((data)=>{
        // 'tap' allows us to perform an action (updating the signal) 
        // without changing the data flowing through the observable
        this._products.set(data);
      })
    );
  }
  getFeaturedProducts(): Observable<ProductDto[]> {
     return this.http.get<ProductDto[]>(this.baseUrl+'product/get-featured-products').pipe(
      tap((data)=>{
        this._fproducts.set(data);
      })
    );
  }

  getProductById(id: number): Observable<ProductDto> {
    return this.http.get<ProductDto>(this.baseUrl + 'product/get-product/' + id);
  }
  createProduct(formData: FormData): Observable<ProductDto> {
    return this.http.post<ProductDto>(this.baseUrl+'product/create-product', formData);
  }

  updateProduct(id: string, formData: FormData): Observable<ProductDto> {
    return this.http.put<ProductDto>(this.baseUrl+'product/update-product/'+id, formData);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(this.baseUrl+'product/delete-product/'+id);
  }

  getStockList(){
    return this.http.get<StockResponse[]>(this.baseUrl+'inventory/stocklist')
  }
  addStock(model:any){
    return this.http.post(this.baseUrl+'inventory/stock-in',model)
  }
  removeStock(model:any){
    return this.http.post(this.baseUrl+'inventory/stock-out',model)
  }
}
