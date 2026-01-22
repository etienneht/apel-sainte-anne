// src/app/admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {  of } from 'rxjs';
import {switchMap, map, take, tap} from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  canActivate() {
    return this.authService.authUser$.pipe(
      take(1),
      switchMap(authUser => {
        if (!authUser) {
          this.router.navigate(['/connexion']);
          return of(false);
        }

        return this.userService.getUser(authUser.uid).pipe(
          take(1),
          map(user => user?.role === 'admin'),
          tap(isAdmin => {
            if (!isAdmin) this.router.navigate(['/']);
          })
        );
      })
    );
  }
}
