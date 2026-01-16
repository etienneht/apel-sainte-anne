import { Routes } from '@angular/router';
import { TestComponent } from './test-component/test-component';
import {HomepageIndex} from './homepage/homepage-index/homepage-index';

export const routes: Routes = [
    {
        path:"",
        component:HomepageIndex
    },
    // Toutes les routes vont ici
    {
        path:"**",
        redirectTo:""
    }
];
