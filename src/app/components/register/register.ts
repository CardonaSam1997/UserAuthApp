import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth';
import { AuthResponse, RegisterRequest } from '@models/auth-models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  registerData: RegisterRequest = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  };

  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    
    if (!this.registerData.name || !this.registerData.email ||
        !this.registerData.password || !this.registerData.confirmPassword) {
      this.errorMessage.set('Por favor, completa todos los campos');
      return;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden');
      return;
    }
    
    if (this.registerData.password.length < 6) {
      this.errorMessage.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    
    this.authService.register(this.registerData).subscribe({
      next: (response: AuthResponse) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        this.router.navigate(['/users']);
      },
      error: () => {
        this.errorMessage.set('Error al registrarse. Por favor, intenta de nuevo.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

}