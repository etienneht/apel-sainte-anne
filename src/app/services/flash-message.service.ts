import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type FlashMessageType = 'success' | 'error';

export interface FlashMessage {
  message: string;
  type: FlashMessageType;
}

@Injectable({
  providedIn: 'root'
})
export class FlashMessageService {

  private messageSubject = new BehaviorSubject<FlashMessage | null>(null);
  message$ = this.messageSubject.asObservable();

  success(message: string) {
    this.messageSubject.next({ message, type: 'success' });
  }

  error(message: string) {
    this.messageSubject.next({ message, type: 'error' });
  }

  clear() {
    this.messageSubject.next(null);
  }
}
