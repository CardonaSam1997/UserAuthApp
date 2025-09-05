import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-user-update',
  standalone: true,  
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-update.html',
  styleUrl: './user-update.scss'
})
export class UserUpdate {

  editUserForm!: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {}
  
  ngOnInit(): void {
      const userId = this.route.snapshot.paramMap.get('id');
  console.log("ID recibido:", userId);


    this.editUserForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      rol: ['', Validators.required],
      password: ['', [Validators.minLength(6)]] 
    });

    this.editUserForm.patchValue({
      nombre: 'Juan Pérez',
      correo: 'juan@example.com',
      rol: 'Usuario'
    });
  }

  onSubmit(): void {
    if (this.editUserForm.valid) {
      console.log('Datos editados:', this.editUserForm.value);
    } else {
      this.editUserForm.markAllAsTouched();
    }
  } 

}