import { Component } from '@angular/core';
import {HomepageServices} from '../homepage-services/homepage-services';
import {HomepageBanner} from '../homepage-banner/homepage-banner';

@Component({
  selector: 'app-homepage-index',
  imports: [
    HomepageServices,
    HomepageBanner
  ],
  templateUrl: './homepage-index.html',
  styleUrl: './homepage-index.css',
})
export class HomepageIndex {

}
