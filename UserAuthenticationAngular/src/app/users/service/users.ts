import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult, User, UserProfile } from '@models/auth-models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.apiUrl}/users`;


  constructor(private http: HttpClient) {}

  
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user, {
      headers: this.getAuthHeaders()
    });
  }

  getUsers(search: string = '', page: number = 1, size: number = 5): Observable<PagedResult<User>> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page)
      .set('size', size);

    return this.http.get<PagedResult<User>>(this.apiUrl, { params,headers: this.getAuthHeaders()});
  }
  
  getUserById(id: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateUser(id: string, user: User): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, user, {
      headers: this.getAuthHeaders()
    });
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }  

}