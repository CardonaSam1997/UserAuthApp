import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth';
import { LoginRequest } from '@models/auth-models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
  ) {}

  onSubmit(): void {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage.set('Por favor, completa todos los campos');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.router.navigate(['/users']);
      },
      error: (error) => {
        this.errorMessage.set('Error al iniciar sesión. Por favor, intenta de nuevo.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
}
