import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/partials/navbar/navbar';
import {FlashMessageComponent} from './components/partials/flash-message/flash-message';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, FlashMessageComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('stage-angular');
}
