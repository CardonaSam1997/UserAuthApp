import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule],
  templateUrl: './user-details.html',
  styleUrl: './user-details.scss'
})
export class UserDetails {

 user: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    // Simulación: en un caso real harías una petición HTTP al backend
    this.user = {
      id,
      nombre: 'Juan Pérez',
      correo: 'juan.perez@example.com',
      rol: 'Administrador',
      estado: true,
      fechaCreacion: new Date('2023-07-15')
    };
  }
}