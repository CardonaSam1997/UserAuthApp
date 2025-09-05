import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth';
import { LoginRequest } from '@models/auth-models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  loginData: LoginRequest = { email: '', password: '' };
  errorMessage = signal<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {}

  registro() {
    this.router.navigate(['/register']);
  }

  onSubmit(): void {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage.set('Por favor, completa todos los campos');
      return;
    }

    this.errorMessage.set(null);

    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        if (res?.token && res.user) {
          this.authService.setSession(res);
          
          const role = res.user.role;
          if (role === 'admin') {
            this.router.navigate(['/users']);
          } else if (role === 'user') {
            this.router.navigate(['/users/profile']);
          } else {
            this.router.navigate(['/not-authorized']);
          }
        } else {
          this.errorMessage.set('Credenciales inválidas o respuesta incompleta.');
        }
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.errorMessage.set('Error al iniciar sesión. Por favor, intenta de nuevo.');
      }
    });
  }
}