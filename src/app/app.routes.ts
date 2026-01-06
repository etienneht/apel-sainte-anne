import { Routes } from '@angular/router';
import { TestComponent } from './test-component/test-component';

export const routes: Routes = [
    {
        path:"",
        component:TestComponent
    },
    // Toutes les routes vont ici
    {
        path:"**",
        component:TestComponent
    }
];
