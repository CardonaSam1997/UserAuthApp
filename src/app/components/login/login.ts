import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth';
import { AuthResponse, LoginRequest } from '@models/auth-models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  loginData: LoginRequest = {
    email: '',
    password: ''
  };

  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {    }

  registro() {
    this.router.navigate(['/register']);
  }

  onSubmit(): void {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage.set('Por favor, completa todos los campos');
      return;
    }

    this.isLoading.set(false);
    this.errorMessage.set(null);

    this.authService.login(this.loginData).subscribe({
      next: (res) => {
  console.log("✅ Respuesta login:", res);

  if (res?.token) {
    this.authService.setSession(res);
    this.router.navigate(['/users']);
  } else {
    this.errorMessage.set('Credenciales inválidas o respuesta incompleta.');
  }
},

      error: (err) => {
        console.error('❌ Error en login:', err);
        this.errorMessage.set('Error al iniciar sesión. Por favor, intenta de nuevo.');
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
}
