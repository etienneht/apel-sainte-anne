import {Routes} from '@angular/router';
import {HomepageIndex} from './homepage/homepage-index/homepage-index';
import {Volunteer} from './volunteer/volunteer';
import {NotFound} from './technical/not-found/not-found';
import {AdminIndex} from './admin/index';
import {LoginComponent} from './technical/login/login';
import {RegisterComponent} from './technical/register/register';
import {AuthGuard} from './auth.guard';
import {AdminGuard} from './admin.guard';


export const routes: Routes = [
  {
    path: "",
    component: HomepageIndex
  },

  {
    path: 'benevolat',
    component: Volunteer
  },
  {
    path: 'connexion',
    component: LoginComponent
  },
  {
    path: 'creer-compte',
    component: RegisterComponent
  },


  {
    path: 'admin',
    component: AdminIndex,
  },

  {
    path: "**",
    component: NotFound
  }
];
