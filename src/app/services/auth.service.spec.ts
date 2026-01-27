import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Auth } from '@angular/fire/auth';
import { of } from 'rxjs';

// ✅ MOCK PARTIEL du module AngularFire Auth
jest.mock('@angular/fire/auth', () => {
  const actual = jest.requireActual('@angular/fire/auth');

  return {
    ...actual, // 👈 garde Auth, InjectionToken, etc.
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    setPersistence: jest.fn(() => Promise.resolve()),
    authState: jest.fn(() => of(null)),
    browserLocalPersistence: {}
  };
});

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from '@angular/fire/auth';

describe('AuthService', () => {
  let service: AuthService;

  const authMock = {
    currentUser: null
  } as Auth;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: Auth,
          useValue: authMock
        }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  // ==========================
  // SIGN UP
  // ==========================
  it('doit créer un utilisateur (signUp)', done => {
    (createUserWithEmailAndPassword as jest.Mock)
      .mockResolvedValue({ user: { uid: '123' } });

    service.signUp('test@mail.com', 'password123')
      .subscribe(result => {
        expect(result.user.uid).toBe('123');
        done();
      });
  });

  it('doit retourner un message lisible si email déjà utilisé', done => {
    (createUserWithEmailAndPassword as jest.Mock)
      .mockRejectedValue({ code: 'auth/email-already-in-use' });

    service.signUp('test@mail.com', 'password123')
      .subscribe({
        error: err => {
          expect(err.message)
            .toBe('Cette adresse email est déjà utilisée');
          done();
        }
      });
  });

  // ==========================
  // SIGN IN
  // ==========================
  it('doit connecter un utilisateur (signIn)', done => {
    (signInWithEmailAndPassword as jest.Mock)
      .mockResolvedValue({ user: { uid: '456' } });

    service.signIn('test@mail.com', 'password123')
      .subscribe(result => {
        expect(result.user.uid).toBe('456');
        done();
      });
  });

  // ==========================
  // SIGN OUT
  // ==========================
  it('doit déconnecter l’utilisateur', done => {
    (signOut as jest.Mock).mockResolvedValue(undefined);

    service.signOut().subscribe(() => {
      expect(signOut).toHaveBeenCalled();
      done();
    });
  });

  // ==========================
  // RESET PASSWORD
  // ==========================
  it('doit envoyer un email de réinitialisation', done => {
    (sendPasswordResetEmail as jest.Mock)
      .mockResolvedValue(undefined);

    service.resetPassword('test@mail.com')
      .subscribe(() => {
        expect(sendPasswordResetEmail).toHaveBeenCalled();
        done();
      });
  });
});
