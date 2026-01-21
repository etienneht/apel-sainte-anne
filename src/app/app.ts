import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import {FlashMessageComponent} from './technical/flash-message/flash-message';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, FlashMessageComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('stage-angular');
}
