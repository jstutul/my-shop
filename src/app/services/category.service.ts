import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CategoryDto } from '../models/category.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Category {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl; 

  getCategory(){
    return this.http.get<CategoryDto[]>(this.baseUrl+'category/get-categories');
  }

  addCategory(model:CategoryDto){
    return this.http.post(this.baseUrl+'category/create-category',model);
  }

  updateCategory(id:number,model:CategoryDto){
    console.log(id,model);
    return this.http.put(this.baseUrl+'category/update-category/'+id,model);
  }

  deleteCategory(id:number){
    return this.http.delete(this.baseUrl+'category/delete-category/'+id);
  }
}
