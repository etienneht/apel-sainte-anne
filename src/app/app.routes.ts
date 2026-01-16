import { Routes } from '@angular/router';
import { Home } from './home/home';

export const routes: Routes = [
    {
        path:"",
        component: Home
    },
    // Toutes les routes vont ici
    {
        path:"**",
        redirectTo:""
    }
];
