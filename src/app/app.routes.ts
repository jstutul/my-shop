import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Shop } from './pages/shop/shop';
import { Cart } from './pages/cart/cart';
import { Profile } from './pages/profile/profile';
import { Details } from './pages/details/details';
import { Checkout } from './pages/checkout/checkout';
import { Payment } from './pages/payment/payment';
import { authGuard } from './guard/auth-guard';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { adminGuard } from './guard/admin-guard';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { App } from './app';
import { Customer } from './layout/customer/customer';
import {CustomerAdmin} from './admin/customer/customer';
import { Products } from './admin/products/products';
import { Categories } from './admin/categories/categories';
import { Orders } from './admin/orders/orders';

export const routes: Routes = [
    {
        path:'',
        component:Customer,
        children:[
            {path:'',component:Home},
            {path:'shop',component:Shop},
            {path:'product/:id',component:Details,canActivate: [authGuard]},
            {path:'login',component:Login},
            {path:'cart',component:Cart, canActivate: [authGuard]},
            {path:'checkout',component:Checkout, canActivate: [authGuard]},
            {path:'payment-success',component:Payment, canActivate: [authGuard]},
            {path:'profile',component:Profile, canActivate: [authGuard]},
        ]
    },
    {
        path:'admin',
        canActivate: [adminGuard],
        component:AdminLayout,
        children:[
            {
                path:'',
                redirectTo:'dashboard',
                pathMatch:'full'
            },
            {
                path:'dashboard',
                component:Dashboard
            },
            {
                path:'products',
                component:Products
            },
            {
                path:'categories',
                component:Categories
            },
            {
                path:'orders',
                component:Orders
            },{
                path:'customers',
                component:CustomerAdmin
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
