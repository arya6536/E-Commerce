import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserStorageService } from '../../../services/storage/user-storage.service';

const BASIC_URL = "http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  addCategory(categoryDto: any): Observable<any> {
    return this.http.post(BASIC_URL + 'api/admin/category', categoryDto, {
      headers: this.createAuthorizationHeader(),
    }).pipe(
      catchError((error) => {
        console.error('Error adding category:', error);  // Log error details
        return throwError(() => error);  // Pass the error to the component for handling
      })
    );
  }

  getAllCategories(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin', {
      headers: this.createAuthorizationHeader(),
    }).pipe(
      catchError((error) => {
        console.error('Error fetching categories:', error);  // Log error details
        return throwError(() => error);  // Pass the error to the component for handling
      })
    );
  }
  

  addProduct(productDto: any): Observable<any> {
    return this.http.post(BASIC_URL + 'api/admin/product', productDto, {
      headers: this.createAuthorizationHeader(),
    }).pipe(
      catchError((error) => {
        console.error('Error adding category:', error);  // Log error details
        return throwError(() => error);  // Pass the error to the component for handling
      })
    );
  }

  updateProduct(productId:any, productDto: any): Observable<any> {
    return this.http.put(BASIC_URL + `api/admin/product/${productId}`, productDto, {
      headers: this.createAuthorizationHeader(),
    }).pipe(
      catchError((error) => {
        console.error('Error ', error);  
        return throwError(() => error);  
      })
    );
  }

  getAllProducts(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/products', {
      headers: this.createAuthorizationHeader(),
    }).pipe(
      catchError((error) => {
        console.error('Error fetching categories:', error);  // Log error details
        return throwError(() => error);  // Pass the error to the component for handling
      })
    );
  }

  getAllProductsByName(name:any): Observable<any> {
    return this.http.get(BASIC_URL + `api/admin/search/${name}`, {
      headers: this.createAuthorizationHeader(),
    }).pipe(
      catchError((error) => {
        console.error('Error fetching categories:', error);  // Log error details
        return throwError(() => error);  // Pass the error to the component for handling
      })
    );
  }

  getProductById(productId): Observable<any> {
    return this.http.get(BASIC_URL + `api/admin/product/${productId}`, {
      headers: this.createAuthorizationHeader(),
    }).pipe(
      catchError((error) => {
        console.error('Error', error);  
        return throwError(() => error);  
      })
    );
  }

  deleteProduct(productId: any): Observable<any> {
    return this.http.delete(BASIC_URL + `api/admin/product/${productId}`, {
      headers: this.createAuthorizationHeader(),
    }).pipe(
      catchError((error) => {
        console.error('Error adding category:', error);  // Log error details
        return throwError(() => error);  // Pass the error to the component for handling
      })
    );
  }

  getPlacedOrders(): Observable<any> {
    return this.http.get(BASIC_URL + `api/admin/placedOrders`, {
      headers: this.createAuthorizationHeader(),
    }).pipe(
      catchError((error) => {
        console.error('Error ', error);  
        return throwError(() => error);  
      })
    );
  }

  changeOrderStatus(orderId:number, status:string): Observable<any> {
    return this.http.get(BASIC_URL + `api/admin/order/${orderId}/${status}`, {
      headers: this.createAuthorizationHeader(),
    }).pipe(
      catchError((error) => {
        console.error('Error ', error);  
        return throwError(() => error);  
      })
    );
  }
  

  private createAuthorizationHeader(): HttpHeaders {
    const token = UserStorageService.getToken();
    if (!token) {
      console.error('No token found');
      return new HttpHeaders();
    }
    return new HttpHeaders().set('Authorization', 'Bearer ' + token);
  }
  
}
