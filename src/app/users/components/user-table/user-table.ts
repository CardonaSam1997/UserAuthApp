import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../service/users';
import { User } from '@models/auth-models';
import { UserStateService } from '../../service/user-state-service';


@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-table.html',
  styleUrl: './user-table.scss'
})
export class UserTable implements OnInit {
  users: User[] = [];
  searchTerm: string = '';
  page: number = 1;
  size: number = 5;
  total: number = 0;

  constructor(private router: Router, private userService: UserService, private userState: UserStateService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(this.searchTerm, this.page, this.size).subscribe({
      next: (res) => {
        this.users = res.items;  
        this.total = res.total;  
      },
      error: (err) => {
        console.error('Error cargando usuarios', err);
      }
    });
  }

  onSearch() {
    this.page = 1; 
    this.loadUsers();
  }

  changePage(newPage: number) {
    this.page = newPage;
    this.loadUsers();
  }

  viewDetailsUser(user: User) {
    this.userState.setUser(user);
    this.router.navigate(['/users/profile']); 
  }

  updateUser(user: User) {
    this.router.navigate([`/users/${user.id}/edit`]);
  }

  deleteUser(user: User) {
    alert(`Eliminar usuario ${user.name}`);
  }
}
