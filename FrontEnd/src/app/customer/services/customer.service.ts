import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { UserStorageService } from '../../../services/storage/user-storage.service';

const BASIC_URL = "http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/customer/products', {
      headers: this.createAuthorizationHeader(),
    }).pipe(
      catchError((error) => {
        console.error('Error fetching categories:', error);  // Log error details
        return throwError(() => error);  // Pass the error to the component for handling
      })
    );
  }

  getAllProductsByName(name:any): Observable<any> {
    return this.http.get(BASIC_URL + `api/customer/search/${name}`, {
      headers: this.createAuthorizationHeader(),
    }).pipe(
      catchError((error) => {
        console.error('Error', error);  
        return throwError(() => error);  
      })
    );
  }

  addToCart(productId: any, quantity: number = 1): Observable<any> {
    const cartDto = {
      productId: productId,
      userId: UserStorageService.getUserId(),
      quantity: quantity // Add quantity to the DTO
    };
    return this.http.post(BASIC_URL + `api/customer/cart`, cartDto, {
      headers: this.createAuthorizationHeader(),
    }).pipe(
      catchError((error) => {
        console.error('Error while adding product to cart:', error);
        return throwError(() => error);
      })
    );
}

getCartByUserId(): Observable<any> {
  const userId = UserStorageService.getUserId()
  return this.http.get(BASIC_URL + `api/customer/cart/${userId}`, {
    headers: this.createAuthorizationHeader(),
  }).pipe(
    catchError((error) => {
      console.error('Error', error);  
      return throwError(() => error);  
    })
  );
}

increaseProductQuantity(productId: any): Observable<any> {
  const cartDto = {
    productId: productId,
    userId: UserStorageService.getUserId()
  }
  return this.http.post(BASIC_URL + `api/customer/addition`, cartDto, {
    headers: this.createAuthorizationHeader(),
  }).pipe(
    catchError((error) => {
      console.error('Error', error);
      return throwError(() => error);
    })
  );
}

decreaseProductQuantity(productId: any): Observable<any> {
  const cartDto = {
    productId: productId,
    userId: UserStorageService.getUserId()
  }
  return this.http.post(BASIC_URL + `api/customer/deduction`, cartDto, {
    headers: this.createAuthorizationHeader(),
  }).pipe(
    catchError((error) => {
      console.error('Error', error);
      return throwError(() => error);
    })
  );
}

placeOrder(orderDto: any): Observable<any> {
  orderDto.userId = UserStorageService.getUserId()
  return this.http.post(BASIC_URL + `api/customer/placeOrder`, orderDto, {
    headers: this.createAuthorizationHeader(),
  }).pipe(
    catchError((error) => {
      console.error('Error', error);
      return throwError(() => error);
    })
  );
}

getOrdersByUserId(): Observable<any> {
  const userId = UserStorageService.getUserId()
  return this.http.get(BASIC_URL + `api/customer/myOrders/${userId}`,  {
    headers: this.createAuthorizationHeader(),
  }).pipe(
    catchError((error) => {
      console.error('Error', error);
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
