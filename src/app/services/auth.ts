import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/auth-models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        const userObj = JSON.parse(user);
        this.currentUserSubject.next(userObj);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        this.clearStoredData();
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // For demo purposes, we'll simulate a successful login
    // In a real app, this would be an HTTP call to your backend
    return of({
      user: {
        id: 1,
        email: credentials.email,
        name: credentials.email.split('@')[0]
      },
      token: 'demo-jwt-token-' + Date.now()
    }).pipe(
      tap(response => {
        this.setSession(response);
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    // For demo purposes, we'll simulate a successful registration
    // In a real app, this would be an HTTP call to your backend
    return of({
      user: {
        id: Date.now(),
        email: userData.email,
        name: userData.name
      },
      token: 'demo-jwt-token-' + Date.now()
    }).pipe(
      tap(response => {
        this.setSession(response);
      })
    );
  }

  logout(): void {
    this.clearStoredData();
  }

  private setSession(authResult: AuthResponse): void {
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('user', JSON.stringify(authResult.user));
    this.currentUserSubject.next(authResult.user);
    this.isAuthenticatedSubject.next(true);
  }

  private clearStoredData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
