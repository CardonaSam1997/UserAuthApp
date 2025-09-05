import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../service/users';
import { AuthService } from 'src/app/services/auth';
import { User } from '@models/auth-models';

@Component({
  selector: 'app-user-update',
  standalone: true,  
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-update.html',
  styleUrl: './user-update.scss'
})
export class UserUpdate implements OnInit {

  editUserForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute,
    private usersService: UserService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');

    // Definir el formulario con los campos adicionales
    this.editUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],   
      estado: ['', Validators.required], 
      password: ['', [Validators.minLength(6)]]
    });

    if (userId) {
      this.usersService.getUserById(userId).subscribe({
        next: (user: User) => {
          this.editUserForm.patchValue({
            name: user.name,
            email: user.email,
            role: user.role,
            estado: user.isActive ? 'Activo' : 'Inactivo',
            
          });
        },
        error: (err) => console.error('Error al cargar usuario:', err)
      });
    }
  }

onSubmit(): void {
  if (this.editUserForm.valid) {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      const formValue = this.editUserForm.value;

      // Construir payload
      const payload: any = {
        id: userId,
        name: formValue.name,
        email: formValue.email,
        role: formValue.role,
        isActive: formValue.estado === 'Activo' // convertir a boolean
      };

      if (formValue.password && formValue.password.length >= 6) {
        payload.passwordHash = formValue.password; // ⚠ coincide con el modelo backend
      }

      this.usersService.updateUser(userId, payload).subscribe({
        next: () => {
          console.log('Usuario actualizado correctamente');

          // Redirigir según rol del usuario logueado
          const currentUser = this.authService.getCurrentUser();
          if (currentUser?.role === 'admin') {
            this.router.navigate(['/users']); 
          } else if (currentUser?.role === 'user') {
            this.router.navigate(['/users/profile']);
          } else {
            this.router.navigate(['/login']); 
          }
        },
        error: (err) => {
          console.error('Error al actualizar usuario:', err);
        }
      });
    }
  } else {
    this.editUserForm.markAllAsTouched();
  }
}

}
