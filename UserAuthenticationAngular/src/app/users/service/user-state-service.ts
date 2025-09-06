import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '@models/auth-models';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private selectedUser = new BehaviorSubject<User | null>(null);
  selectedUser$ = this.selectedUser.asObservable();

  setUser(user: User) {
    this.selectedUser.next(user);
  }
}
