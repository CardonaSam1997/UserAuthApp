import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './user-table.html',
  styleUrl: './user-table.scss'
})
export class UserTable {

  constructor(private router: Router) {}

   users = [
    { id: 1, name: 'Juan', email: 'juan@mail.com' },
    { id: 2, name: 'Ana', email: 'ana@mail.com' },
    { id: 3, name: 'Pedro', email: 'pedro@mail.com' }
  ];

  viewDetailsUser(user: any) {
    this.router.navigate([`/users/profile`]);
  }


  updateUser(user: any) {
    this.router.navigate([`/users/${user.id}/edit`]);
  }


  deleteUser(user: any) {
    alert(`Eliminar usuario`);
  }

}