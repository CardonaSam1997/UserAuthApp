import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserStateService } from '../../service/user-state-service';
import { UserProfile } from '@models/auth-models';
import { UserService } from '../../service/users';
import { AuthService } from '@services/auth';


@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-details.html',
  styleUrl: './user-details.scss'
})
export class UserDetails {
  user: UserProfile | null = null;

  constructor(
    private userState: UserStateService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userState.selectedUser$.subscribe(selectedUser => {
      if (selectedUser && selectedUser.id) {        
        this.userService.getUserById(selectedUser.id).subscribe({
          next: data => this.user = data,
          error: () => console.error('No se pudo cargar el detalle del usuario')
        });
      } else {        
        const currentUser = this.authService.getCurrentUser();
        if (currentUser && currentUser.id) {
          this.userService.getUserById(currentUser.id).subscribe({
            next: data => this.user = data,
            error: () => console.error('No se pudo cargar los datos del usuario logueado')
          });
        }
      }
    });
  }
}