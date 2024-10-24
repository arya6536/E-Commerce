
import { NgModule } from '@angular/core';
import {RouterModule,Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DemoAngularMaterailModule } from './DemoAngularMaterialModule';
import { DashboardComponent } from './admin/components/dashboard/dashboard.component';
import { AdminRoutingModule } from './admin/admin-routing.module';
import { CustomerRoutingModule } from './customer/customer-routing.module';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
    { path: 'customer', loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule) },
    { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
    { path: '**', redirectTo: '/login' },
  ];

  NgModule({
    declarations: [AppComponent, SignupComponent, LoginComponent],
    imports: [
      BrowserModule,
      ReactiveFormsModule,
      FormsModule,
      HttpClientModule,
      DemoAngularMaterailModule,
      AdminRoutingModule,
      CustomerRoutingModule,
      RouterModule.forRoot(routes) // Import RouterModule with routes configuration
    ],
    })
    
 
