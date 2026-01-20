import { Routes } from '@angular/router';
import {HomepageIndex} from './homepage/homepage-index/homepage-index';
import { Volunteer } from './volunteer/volunteer';



export const routes: Routes = [
    {
        path:"",
        component:HomepageIndex
    },

    { 
        path: 'volunteer', 
        component:Volunteer 
    },

    {
        path:"**",
        redirectTo:""
    }
];
