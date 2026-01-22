import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {FlashMessageService} from '../../../services/flash-message.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CommonModule
  ],
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private flashMessageService: FlashMessageService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      // mdp obligatoire 8 caractères, majuscule, minuscule, caractère spécial et un chiffre
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
          )
        ]
      ]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      const { email, password } = this.registerForm.value;

      this.authService.signUp(email, password).subscribe({
        next: () => {
          this.flashMessageService.success(
            'Inscription réussie! Vous pouvez maintenant vous connecter.'
          );
          this.router.navigate(['/connexion']);
        },
        error: (error) => {
          this.flashMessageService.error(
            error?.message ?? 'Erreur lors de l’inscription.'
          );
          this.isLoading = false;
        }
      });
    }
  }
}
