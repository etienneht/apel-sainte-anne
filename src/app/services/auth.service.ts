import { Injectable, NgZone } from '@angular/core';
import {catchError, from, Observable, throwError} from 'rxjs';
import { environment } from '../../environments/environment';

import {
  Auth,
  authState,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  User
} from '@angular/fire/auth';

import {UserService} from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  authUser$: Observable<User | null>;

  constructor(
    private auth: Auth
  ) {
    this.authUser$ = authState(this.auth);
  }


  // ==========================
  // SIGN UP
  // ==========================
  signUp(email: string, password: string) {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      catchError(err =>
        throwError(() => this.handleError(err, 'inscription'))
      )
    );
  }

  // ==========================
  // SIGN IN
  // ==========================
  signIn(email: string, password: string) {
    return from(
      setPersistence(this.auth, browserLocalPersistence)
        .then(() => signInWithEmailAndPassword(this.auth, email, password))
    ).pipe(
      catchError(err =>
        throwError(() => this.handleError(err, 'connexion'))
      )
    );
  }

  // ==========================
  // SIGN OUT
  // ==========================
  signOut() {
    return from(signOut(this.auth)).pipe(
      catchError(err =>
        throwError(() => this.handleError(err, 'déconnexion'))
      )
    );
  }

  // ==========================
  // RESET PASSWORD
  // ==========================
  resetPassword(email: string) {
    return from(
      sendPasswordResetEmail(this.auth, email, {
        url: environment.baseUrl + '/reset-password'
      })
    ).pipe(
      catchError(err =>
        throwError(() => this.handleError(err, 'réinitialisation du mot de passe'))
      )
    );
  }

  private handleError(error: any, operation: string): Error {
    const map: Record<string, string> = {
      'auth/email-already-in-use': 'Cette adresse email est déjà utilisée',
      'auth/invalid-email': 'Adresse email invalide',
      'auth/user-not-found': 'Utilisateur non trouvé',
      'auth/wrong-password': 'Mot de passe incorrect',
      'auth/weak-password': 'Mot de passe trop faible'
    };

    return new Error(map[error.code] ?? `Erreur lors de ${operation}`);
  }
}

