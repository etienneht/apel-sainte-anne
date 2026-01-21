import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
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

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private auth: Auth,
    private ngZone: NgZone,
    private userService: UserService
  ) {}

  // ==========================
  // AUTH STATE
  // ==========================
  getAuthUser(): Observable<User | null> {
    return authState(this.auth);
  }

  // ==========================
  // SIGN UP
  // ==========================
  signUp(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.ngZone.run(async () => {
        let cred: any;

        try {
          // Création Firebase Auth
          cred = await createUserWithEmailAndPassword(this.auth, email, password);
          const uid = cred.user.uid;

          // Création Firestore user
          await this.userService.createUser({
            uid,
            firstname: '',
            lastname: '',
            email,
            role: 'user',
            totalHours: 0,
            createdAt: new Date()
          });


          observer.next(cred);
          observer.complete();

        } catch (error: any) {

          //Rollback si Firestore échoue
          if (cred?.user) {
            await cred.user.delete();
          }

          observer.error(this.handleError(error, 'inscription'));
        }
      });
    });
  }



  // ==========================
  // SIGN IN
  // ==========================
  signIn(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.ngZone.run(() => {
        setPersistence(this.auth, browserLocalPersistence)
          .then(() =>
            signInWithEmailAndPassword(this.auth, email, password)
          )
          .then(cred => {
            observer.next(cred);
            observer.complete();
          })
          .catch(error =>
            observer.error(this.handleError(error, 'connexion'))
          );
      });
    });
  }

  // ==========================
  // SIGN OUT
  // ==========================
  signOut(): Observable<void> {
    return new Observable(observer => {
      this.ngZone.run(() => {
        signOut(this.auth)
          .then(() => {
            observer.next();
            observer.complete();
          })
          .catch(error =>
            observer.error(this.handleError(error, 'déconnexion'))
          );
      });
    });
  }



  // ==========================
  // RESET PASSWORD
  // ==========================
  resetPasswordInit(email: string): Observable<void> {
    return new Observable(observer => {
      this.ngZone.run(() => {
        sendPasswordResetEmail(this.auth, email, {
          url: environment.baseUrl + '/reset-password',
        })
          .then(() => {
            observer.next();
            observer.complete();
          })
          .catch(error =>
            observer.error(this.handleError(error, 'réinitialisation du mot de passe'))
          );
      });
    });
  }

  // ==========================
  // ERROR HANDLING
  // ==========================
  private handleError(error: any, operation: string): Error {
    console.error(`Erreur lors de ${operation}`, error);

    let message = `Une erreur est survenue lors de ${operation}`;

    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'Cette adresse email est déjà utilisée';
        break;
      case 'auth/invalid-email':
        message = 'Adresse email invalide';
        break;
      case 'auth/user-not-found':
        message = 'Utilisateur non trouvé';
        break;
      case 'auth/wrong-password':
        message = 'Mot de passe incorrect';
        break;
      case 'auth/weak-password':
        message = 'Mot de passe trop faible';
        break;
    }

    return new Error(message);
  }
}
