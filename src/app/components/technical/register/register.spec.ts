import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../../../services/auth.service';
import { FlashMessageService } from '../../../services/flash-message.service';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register';
import { UserCredential } from 'firebase/auth';


describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jest.Mocked<AuthService>;
  let flashMessageService: jest.Mocked<FlashMessageService>;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule
      ],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn()
          }
        },
        {
          provide: FlashMessageService,
          useValue: {
            success: jest.fn(),
            error: jest.fn()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    flashMessageService = TestBed.inject(
      FlashMessageService
    ) as jest.Mocked<FlashMessageService>;

    router = TestBed.inject(Router) as jest.Mocked<Router>;
    jest.spyOn(router, 'navigate').mockImplementation(jest.fn());

    fixture.detectChanges();
  });


  it('doit créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('doit avoir un formulaire invalide au chargement', () => {
    expect(component.registerForm.invalid).toBe(true);
  });

  it('doit rendre le formulaire valide avec des valeurs correctes', () => {
    component.registerForm.setValue({
      email: 'test@example.com',
      password: 'Password1!'
    });

    expect(component.registerForm.valid).toBe(true);
  });

  it("doit appeler l'inscription et rediriger en cas de succès", () => {
    const mockCredential = {} as UserCredential;

    authService.signUp.mockReturnValue(of(mockCredential));

    component.registerForm.setValue({
      email: 'test@example.com',
      password: 'Password1!'
    });

    component.onSubmit();

    expect(authService.signUp).toHaveBeenCalledWith(
      'test@example.com',
      'Password1!'
    );

    expect(flashMessageService.success).toHaveBeenCalledWith(
      'Inscription réussie! Vous pouvez maintenant vous connecter.'
    );

    expect(router.navigate).toHaveBeenCalledWith(['/connexion']);
  });

  it("doit afficher un message d'erreur si l'inscription échoue", () => {
    authService.signUp.mockReturnValue(
      throwError(() => ({ message: 'Erreur API' }))
    );

    component.registerForm.setValue({
      email: 'test@example.com',
      password: 'Password1!'
    });

    component.onSubmit();

    expect(flashMessageService.error).toHaveBeenCalledWith('Erreur API');
    expect(component.isLoading).toBe(false);
  });
});
