import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {NgIf} from '@angular/common';
import {UserService} from '../../services/user.service';
import {switchMap, take} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink
  ],
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.successMessage = navigation?.extras.state?.['successMessage'] ?? null;
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;

    const { email, password } = this.loginForm.value;

    this.authService.signIn(email, password).pipe(
      switchMap(() => this.authService.getAuthUser()),
      take(1),
      switchMap(user => this.userService.getUser(user!.uid)),
      take(1)
    ).subscribe({
      next: user => {
        if (!user) {
          this.errorMessage = 'Utilisateur introuvable en base';
          return;
        }

        this.router.navigate([user.role === 'admin' ? '/admin' : '/']);
      },
      error: err => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });

  }


  // Méthode pour réinitialiser le mot de passe
  onResetPassword() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      const { email } = this.loginForm.value;

      this.authService.resetPasswordInit(email).subscribe({
        next: () => {
          console.log('Email de réinitialisation envoyé');
          this.isLoading = false;
          this.errorMessage = 'Un email de réinitialisation a été envoyé';
        },
        error: (error) => {
          console.error('Erreur d\'envoi du mail de réinitialisation', error);
          this.isLoading = false;
          this.errorMessage = error.message;
        }
      });
    }
  }
}
