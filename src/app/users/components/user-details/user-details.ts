import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserStateService } from '../../service/user-state-service';
import { UserProfile } from '@models/auth-models';
import { UserService } from '../../service/users';


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
    private userService: UserService
  ) {}

  ngOnInit() {
  this.userState.selectedUser$.subscribe(user => {
    if (!user) {
      console.warn('No hay usuario seleccionado');
      return;
    }

    // Llamas al backend usando solo el id
    if (user.id) {
      this.userService.getUserById(user.id).subscribe({
        next: (data) => {
          this.user = data;

          // Aquí imprimes en consola
          console.log('Usuario completo:', this.user);
        },
        error: () => console.error('No se pudo cargar el detalle del usuario')
      });
    }
  });
}
}