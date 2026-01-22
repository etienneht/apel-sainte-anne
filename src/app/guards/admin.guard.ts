// src/app/admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.getAuthUser().pipe(
      take(1),
      switchMap((authUser: User | null) => {
        if (!authUser) {
          this.router.navigate(['/connexion']);
          return of(false);
        }

        return this.userService.getUser(authUser.uid).pipe(
          take(1),
          map(user => {
            if (!user || user.role !== 'admin') {
              this.router.navigate(['/']);
              return false;
            }
            return true;
          })
        );
      })
    );
  }
}
