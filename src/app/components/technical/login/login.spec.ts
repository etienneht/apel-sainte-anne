import {ComponentFixture, fakeAsync, flush, TestBed} from '@angular/core/testing';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { provideRouter, Router } from '@angular/router';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { LoginComponent } from './login';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const authUser$ = new BehaviorSubject<any>(null);

  const authServiceMock = {
    signIn: jest.fn(),
    resetPassword: jest.fn(),
    authUser$: authUser$.asObservable()
  };

  const userServiceMock = {
    getUser: jest.fn()
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([
          { path: '', component: LoginComponent },
          { path: 'admin', component: LoginComponent }
        ]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserService, useValue: userServiceMock }
      ]
    }).compileComponents();


    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('ne doit rien faire si le formulaire est invalide', () => {
    component.onSubmit();
    expect(authServiceMock.signIn).not.toHaveBeenCalled();
  });

  it('doit connecter et rediriger un utilisateur standard', fakeAsync(() => {
    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');

    authServiceMock.signIn.mockReturnValue(of(void 0));
    authUser$.next({ uid: '123' });

    userServiceMock.getUser.mockReturnValue(
      of({ uid: '123', role: 'user' })
    );

    component.loginForm.setValue({
      email: 'test@mail.com',
      password: 'password123'
    });

    component.onSubmit();
    flush();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  }));


  it('doit rediriger un admin vers /admin', fakeAsync(() => {
    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');

    authServiceMock.signIn.mockReturnValue(of(void 0));
    authUser$.next({ uid: 'admin-id' });

    userServiceMock.getUser.mockReturnValue(
      of({ uid: 'admin-id', role: 'admin' })
    );

    component.loginForm.setValue({
      email: 'admin@mail.com',
      password: 'password123'
    });

    component.onSubmit();
    flush();

    expect(router.navigate).toHaveBeenCalledWith(['/admin']);
  }));



  it('doit afficher une erreur si signIn échoue', () => {
    authServiceMock.signIn.mockReturnValue(
      throwError(() => new Error('Erreur login'))
    );

    component.loginForm.setValue({
      email: 'fail@mail.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Erreur login');
    expect(component.isLoading).toBe(false);
  });
  it('doit envoyer un email de réinitialisation', () => {
    authServiceMock.resetPassword.mockReturnValue(of(void 0));

    component.loginForm.controls['email'].setValue('test@mail.com');

    component.onResetPassword();

    expect(authServiceMock.resetPassword).toHaveBeenCalledWith('test@mail.com');
    expect(component.errorMessage)
      .toBe('Un email de réinitialisation a été envoyé');
  });
});
