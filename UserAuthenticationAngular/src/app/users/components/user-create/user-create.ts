import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserService } from '../../service/users';
import { User } from '@models/auth-models';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-create.html',
  styleUrl: './user-create.scss'
})
export class UserCreate {
  createUserForm: FormGroup;
  successMessage = signal<string | null>(null); 
  errorMessage = signal<string | null>(null);   

  constructor(
    private fb: FormBuilder, 
    private userService: UserService 
  ) {
    this.createUserForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      rol: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.createUserForm.valid) {
      const newUser: User = {
        name: this.createUserForm.value.nombre,
        email: this.createUserForm.value.correo,
        role: this.createUserForm.value.rol,
        password: this.createUserForm.value.password
      };

      this.userService.createUser(newUser).subscribe({
        next: () => {
          this.successMessage.set('Usuario creado con éxito');
          this.errorMessage.set(null);
          this.createUserForm.reset({ rol: '' });
        },
        error: (err) => {
          console.error('Error al crear usuario:', err);
          this.errorMessage.set(err.error?.error || 'No se pudo crear el usuario');
          this.successMessage.set(null);
        }
      });
    }
  }

  cancelar() {    
    this.createUserForm.reset({ rol: '' });
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }
}