import { Injectable } from '@angular/core';

const TOKEN = 'ecom-token';
const USER = 'ecom-user';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  constructor() { }

  // Change this to a static method
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  public saveToken(token: string): void {
    if (UserStorageService.isBrowser()) {
      window.localStorage.removeItem(TOKEN);
      window.localStorage.setItem(TOKEN, token);
    }
  }

  public saveUser(user: any): void {
    if (UserStorageService.isBrowser()) {
      window.localStorage.removeItem(USER);
      window.localStorage.setItem(USER, JSON.stringify(user));
    }
  }

  static getToken(): string | null {
    if (UserStorageService.isBrowser()) {
      return localStorage.getItem(TOKEN);
    }
    return null; // Return null if not in the browser
  }

  static getUser(): any {
    if (UserStorageService.isBrowser()) {
      return JSON.parse(localStorage.getItem(USER) || 'null');
    }
    return null; // Return null if not in the browser
  }
   
  static getUserId(): string {
    const user = this.getUser();
    if (user == null) {
      return '';
    }
    return user.userId; 
  }

  static getUserRole(): string {
    const user = this.getUser();
    if (user == null) {
      return '';
    }
    return user.role;
  }

  static isAdminLoggedIn(): boolean {
    const token = this.getToken();
    if (token == null) {
      return false;
    }
    const role: string = this.getUserRole();
    return role == 'ADMIN';
  } 

  static isCustomerLoggedIn(): boolean {
    const token = this.getToken();
    if (token == null) {
      return false;
    }
    const role: string = this.getUserRole();
    return role == 'CUSTOMER';
  } 

  static signOut(): void {
    if (UserStorageService.isBrowser()) {
      window.localStorage.removeItem(TOKEN);
      window.localStorage.removeItem(USER);
    }
  }
}
