import {Routes} from '@angular/router';
import {HomepageIndex} from './components/homepage/homepage-index/homepage-index';
import {Volunteer} from './components/volunteer/volunteer';
import {NotFound} from './components/technical/not-found/not-found';
import {AdminIndex} from './components/admin/index';
import {LoginComponent} from './components/technical/login/login';
import {RegisterComponent} from './components/technical/register/register';
import {AdminGuard} from './guards/admin.guard';
import {AdminEventsComponent} from './components/admin/event/event';
import {EventsComponent} from './components/events/events';


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
    path: 'evenements',
    component: EventsComponent
  },
  {
    path: 'events/:id',
    component: EventsComponent // temporaire
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
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/evenements',
    component: AdminEventsComponent,
    canActivate: [AdminGuard]
  },

  {
    path: "**",
    component: NotFound
  }
];
