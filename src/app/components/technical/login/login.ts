import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { switchMap, take, tap } from 'rxjs/operators';

import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [ReactiveFormsModule, NgIf, RouterLink]
})
export class LoginComponent implements OnInit {

  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;
  loginForm!: FormGroup;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {

    this.loginForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

  }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    this.successMessage = navigation?.extras.state?.['successMessage'] ?? null;
  }

  // ==========================
  // LOGIN
  // ==========================
  onSubmit(): void {
    if (this.loginForm.invalid || this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = null;

    const { email, password } = this.loginForm.getRawValue();

    this.authService.signIn(email, password).pipe(
      switchMap(() => this.authService.authUser$),
      take(1),
      switchMap(authUser => {
        if (!authUser) {
          throw new Error('Utilisateur non authentifié');
        }
        return this.userService.getUser(authUser.uid).pipe(take(1));
      }),
      tap(user => {
        if (!user) {
          throw new Error('Utilisateur introuvable en base');
        }
        this.router.navigate([user.role === 'admin' ? '/admin' : '/']);
      })
    ).subscribe({
      error: err => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  // ==========================
  // RESET PASSWORD
  // ==========================
  onResetPassword(): void {
    if (!this.loginForm.controls["email"].valid || this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = null;

    const { email } = this.loginForm.getRawValue();

    this.authService.resetPassword(email).subscribe({
      next: () => {
        this.isLoading = false;
        this.errorMessage = 'Un email de réinitialisation a été envoyé';
      },
      error: err => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }
}
