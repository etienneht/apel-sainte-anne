import { Component } from '@angular/core';
import {CommonModule, NgClass} from '@angular/common';
import {FlashMessage, FlashMessageService} from '../../services/flash-message.service';

@Component({
  selector: 'app-flash-message',
  imports: [
    NgClass,
    CommonModule
  ],
  templateUrl: './flash-message.html',
  styleUrl: './flash-message.css',
})
export class FlashMessageComponent {
  flashMessage: FlashMessage | null = null;

  constructor(private flashMessageService: FlashMessageService) {}

  ngOnInit() {
    this.flashMessageService.message$.subscribe(message => {
      this.flashMessage = message;

      if (message) {
        setTimeout(() => {
          this.flashMessageService.clear();
        }, 4000);
      }
    });
  }
}
