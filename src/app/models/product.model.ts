import { CategoryDto } from "./category.model";

export interface ProductDto {
    id: string;          
    name: string;        
    description: string;  
    price: number;         
    imageUrl: string | null; 
    categoryId: string;   
    category: CategoryDto; 
    isFeatured:boolean;
    stockQuantity:number;
}