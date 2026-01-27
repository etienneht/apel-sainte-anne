import {Timestamp} from '@angular/fire/firestore';

export interface EventData {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  startDate: Timestamp;
  endDate: Timestamp;
  status: 'A venir' | 'En cours' | 'Passé';
  location?: string;
  socialLink?: string;
  paymentLink?: string;
}

