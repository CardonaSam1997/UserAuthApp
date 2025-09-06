import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  imports: [],
  standalone: true,
  templateUrl: './error.html',
  styleUrl: './error.scss'
})
export class ErrorComponent  implements OnInit {
  public message: string = 'Ocurrió un error inesperado.';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    this.message = navigation?.extras.state?.['message'] || this.message;
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}