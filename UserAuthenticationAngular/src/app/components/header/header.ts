import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '@models/auth-models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  @Input() currentUser: User | null = null;
  @Output() logoutEvent = new EventEmitter<void>();

  logout(): void {
    this.logoutEvent.emit();
  }
}
