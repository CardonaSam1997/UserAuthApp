import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-create.html',
  styleUrl: './user-create.scss'
})
export class UserCreate {
  createUserForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.createUserForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      rol: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.createUserForm.valid) {
      const newUser = this.createUserForm.value;
      console.log('Nuevo usuario:', newUser);

      // Aquí podrías llamar al servicio que cree el usuario en tu backend
      // this.userService.create(newUser).subscribe(() => {
      //   this.router.navigate(['/users']);
      // });

      this.router.navigate(['/users']); // Navega de vuelta a la lista
    }
  }

  cancelar() {
    this.router.navigate(['/users']);
  }
}