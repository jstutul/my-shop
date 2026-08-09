import { computed, effect, Injectable, signal } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { String } from '../string/string.enum';
import { ProductDto } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartitems = signal<CartItem[]>(this.loadCartFromStorage());

  items = this.cartitems.asReadonly();
  constructor() {
      // Automatically save whenever cart changes
      effect(() => {
        localStorage.setItem(
          String.STORAGE_KEY,
          JSON.stringify(this.cartitems())
        );
      });
    }
  totalPrice = computed(() => 
    this.cartitems().reduce((acc, item) => acc + (item.price * item.quantity), 0)
  );


  cartCount = computed(() => this.cartitems().length);

  totalItems = computed(() =>
    this.cartitems().reduce((acc,item)=> acc+item.quantity,0)
  );

  subtotal = computed(() =>
    this.cartitems().reduce((total, item) => total + item.price * item.quantity, 0)
  );
  totalPrices = computed(() => this.subtotal());

  setQuantity(productId: string, quantity: number) {
    this.cartitems.update(items => 
      items.map(item => 
        item.productId === productId ? { ...item, quantity: quantity } : item
      )
    );
  }
  addToCart(product:ProductDto,quantity:number=1){
    const currentItem = this.cartitems();
    const existsItem  = currentItem.find(item=>item.productId === product.id);

    if(existsItem){
      this.updateQuantity(product.id,quantity);
    }else{
      const newItem: CartItem={
        productId:product.id,
        name:product.name,
        price:product.price,
        imageUrl:product.imageUrl||'',
        quantity:quantity
      }
      this.cartitems.update(items=>[...items,newItem]);
    }    
  }

  increase(productId: string): void {
    this.updateQuantity(productId, 1);
  }

  decrease(productId: string): void {
    this.updateQuantity(productId, -1);
  }

  updateQuantity(productId:string,delta:number){
    this.cartitems.update(items =>
      items
        .map(item => {

          if (item.productId !== productId) {
            return item;
          }

          return {
            ...item,
            quantity: item.quantity + delta
          };

        })
        .filter(item => item.quantity > 0)
    );
  }
  removeItem(productId: string): void {
    this.cartitems.update(items =>
      items.filter(item => item.productId !== productId)
    );
  }
  getItem(productId: string): CartItem | undefined {
    return this.cartitems().find(item => item.productId === productId);
  }

  isInCart(productId: string): boolean {
    return this.cartitems().some(item => item.productId === productId);
  }
  clearCart(): void {
    this.cartitems.set([]);
  }


  private loadCartFromStorage():CartItem[]{
    try{
      const stored =localStorage.getItem(String.STORAGE_KEY);
      return stored ? JSON.parse(stored):[];
    }catch{
      return [];
    }

  }



}
