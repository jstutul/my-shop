import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ProductDto } from '../../models/product.model';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryDto } from '../../models/category.model';
import { Category } from '../../services/category.service';
import { QuillModule } from 'ngx-quill'; 
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AngularEditorConfig } from '@kolkov/angular-editor';
declare var bootstrap: any;
@Component({
  selector: 'app-products',
  standalone:true,
  imports: [CurrencyPipe,ReactiveFormsModule,QuillModule,FormsModule,AngularEditorModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})

export class Products {
  public baseImageUrl = environment.imageBaseUrl;  
  private formBuilder = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(Category);
  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
};
  
  products  = signal<ProductDto[]>([]);
  categories = signal<CategoryDto[]>([]);
  editingProduct = signal<ProductDto|null>(null);
  imagePreview = signal<string | null>(null); 
  // search 
  searchQuery =signal('');
  currentPage =signal(1);
  selectedCategory = signal<number|0>(0);
  selectedStock = signal<string|''|'active'|'inactive'|'delivered'>('');
  pageSize =10;
  private modal:any;
  selectedFile:File|null=null;
  // form
  productForm = this.formBuilder.group({
    name: ['',Validators.required],        
    description: ['',Validators.required],  
    price: [0.00,[Validators.required,Validators.min(1)]],
    initialStock: [0, [Validators.required, Validators.min(0)]],         
    imageUrl: [''], 
    categoryId: ['1',[Validators.required,Validators.min(1)]],   
    isFeatured:[false]
  });
  readonly isLoading = signal(false);
  readonly errorMessages = signal<string[]>([]);

  filterProduct = computed(()=>{
    console.log(this.selectedStock());
    let list = this.products();
    if(this.searchQuery()){
      const query = this.searchQuery().toLowerCase();
      list = list.filter(p=>p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)); 
    }
    if(this.selectedCategory()){
      list = list.filter(p=>Number(p.categoryId) === Number(this.selectedCategory()));
    }
    
    if (this.selectedStock() === 'active') {
      list = list.filter(p => p.stockQuantity > 0);
    } else if (this.selectedStock() === 'inactive') {
      list = list.filter(p => p.stockQuantity <= 0);
    }

    return list;
  });
  paginatedProducts = computed(()=>{
    const startIndex =(this.currentPage()-1)*this.pageSize;
    return this.filterProduct().slice(startIndex,startIndex+this.pageSize);
  });
  totalPages = computed(() => {
    return Math.ceil(this.filterProduct().length / this.pageSize);
  });

  ngOnInit(){
    this.loadProducts();
    this.loadCategory();
  }
  
  ngAfterViewInit(){
    const element = document.getElementById('productModal');
    if (element) {
      this.modal = new bootstrap.Modal(element);
    }
  }

  loadCategory(){
    this.categoryService.getCategory().subscribe({
      next:cats=>{
        this.categories.set(cats);
      }
    })
  }

  loadProducts(){
    this.productService.getProductList().subscribe({
      next:products=>{this.products .set(products)},
      error: error=>{ console.log(error)}
    });
  }

  openAddProduct(){
    this.editingProduct.set(null);
    this.selectedFile=null;
    this.imagePreview.set(null); 
    this.productForm.reset({
      name: '',
      description: '',
      price: 0.00,
      initialStock: 1,
      imageUrl: '',
      categoryId: '1',
      isFeatured: false
    });
    this.openModal();
  }

  openEditProduct(product:ProductDto){
    this.editingProduct.set(product);
    this.selectedFile=null;
    this.imagePreview.set(this.baseImageUrl + product.imageUrl);

    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      initialStock: product.stockQuantity,
      imageUrl: product.imageUrl,
      categoryId: product.categoryId.toString(), 
      isFeatured: product.isFeatured
    });
    this.openModal();
  }
  removeImage() {
      this.selectedFile = null;
      this.imagePreview.set(null);
      this.productForm.get('imageUrl')?.setValue('');
  }
  onImageSelected($event:any)
  {
    const file = $event.target.files[0];
    if(file){
      this.selectedFile=file;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview.set(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  saveProduct(){
    
    if (this.productForm.invalid) {
      console.log(this.productForm.value);
      this.productForm.markAllAsTouched(); 
      return;
    }
    // use FormData to handle
    const formData =new FormData();
    const formValues = this.productForm.value;

    formData.append('name', formValues.name ?? '');
    formData.append('description', formValues.description ?? '');
    formData.append('price', (formValues.price ?? 0).toString());
    formData.append('categoryId', (formValues.categoryId ?? 0).toString());
    formData.append('isFeatured', (formValues.isFeatured ?? 0).toString());

    if(!this.editingProduct()){
      formData.append('initialStock',(formValues.initialStock ?? 0).toString())
    }

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if(this.editingProduct()){
      const editingProduct = this.editingProduct();
      if(editingProduct){
        const id = editingProduct.id;
        this.productService.updateProduct(id,formData).subscribe({
          next:()=>{
            this.loadProducts();
            this.closeModal();
          },
          error: (err) => alert('Update failed: ' + err.message)
        })
      }
    }else{
      this.productService.createProduct(formData).subscribe({
        next:()=>{
          this.loadProducts();
          this.closeModal();
        },error:(err)=>{
          alert('Created failed');
        }
      })
    }
  }

  deleteProduct(id:string){
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    this.productService.deleteProduct(id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => alert('Delete failed')
    });
  }
  resetPage() {
    this.currentPage.set(1);
  }
  openModal() { this.modal.show(); }
  closeModal() { this.modal.hide(); }
}
