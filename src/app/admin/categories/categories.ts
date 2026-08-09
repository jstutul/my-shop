import { Component, computed, inject, signal } from '@angular/core';
import { Category } from '../../services/category.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryDto } from '../../models/category.model';
declare var bootstrap: any;
@Component({
  selector: 'app-categories',
  imports: [ReactiveFormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  private formBuilder = inject(FormBuilder);
  private categoryService = inject(Category);
  categories = signal<CategoryDto[]>([]);
  editingCategory = signal<CategoryDto|null>(null);
  readonly isLoading = signal(false);
  readonly errorMessages = signal<string[]>([]);
  pageSize =10;
  currentPage =signal(1);
  private modal:any;
  categoryForm = this.formBuilder.group({
    name: ['',Validators.required]
  });
  
  loadCategory(){
    this.categoryService.getCategory().subscribe({
      next:cats=>{
        this.categories.set(cats);
      }
    })
  }

  openAddCategory(){
    this.editingCategory.set(null);
    this.categoryForm.reset({
      name: '',
    });
    this.openModal();
  }
  
  openEditCategory(category:CategoryDto){
    this.editingCategory.set(category);
    this.categoryForm.reset({
      name: category.name,
    });
    this.openModal();
  }
  paginatedCategories = computed(()=>{
    const startIndex =(this.currentPage()-1)*this.pageSize;
    return this.categories().slice(startIndex,startIndex+this.pageSize);
  });

  totalPages = computed(() => {
    return Math.ceil(this.categories().length / this.pageSize);
  });
  saveCategory(){
    if(this.categoryForm.invalid){
      this.categoryForm.markAllAsTouched();
      return;
    }
    if(this.editingCategory()){
      this.updateCategory();
    }else{
      this.addCategory();
    }
  }

  addCategory(){
    this.categoryService.addCategory(this.categoryForm.value as CategoryDto).subscribe({
      next:(response:any)=>{
        this.loadCategory();
        alert(response.message);
        this.closeModal();
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  updateCategory(){
    const editingcat = this.editingCategory();
    if(editingcat){
      const catId = Number(editingcat.id);
      
      this.categoryService.updateCategory(catId,this.categoryForm.value as CategoryDto).subscribe({
          next:(response:any)=>{
            this.loadCategory();
            alert(response.message);
            this.closeModal();
          },error:(err:any)=>{
            console.log(err);
          }
        })
    }
    
  }

  deleteCategory(id:number){
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }
    this.categoryService.deleteCategory(id).subscribe({
      next: () => this.loadCategory(),
      error: (err) => alert('Delete failed')
    });
  }
  ngOnInit(){
    this.loadCategory();
  }
  ngAfterViewInit(){
    const element = document.getElementById('categoryModal');
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
