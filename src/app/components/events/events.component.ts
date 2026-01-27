import {Component, NgZone} from '@angular/core';
import {EventService} from '../../services/event.service';
import {EventData} from '../../models/event.model';
import {RouterLink} from '@angular/router';
import {CommonModule, NgClass, NgForOf} from '@angular/common';
import {Timestamp} from '@angular/fire/firestore';

@Component({
  selector: 'app-events',
  imports: [
    RouterLink,
    NgForOf,
    CommonModule,
    NgClass
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {
  events: EventData[] = [];
  isLoading = true;

  constructor(private eventService: EventService,   private zone: NgZone) { }

  ngOnInit(): void {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.zone.run(() => {
          this.events = events.map(event => ({
            ...event,
            status: this.getEventStatus(event.startDate, event.endDate)
          }));

          this.isLoading = false;
        });
      },
      error: (error) => {
        this.zone.run(() => {
          console.error('Erreur lors de la récupération des évènements:', error);
          this.isLoading = false;
        });
      },
    });
  }





  getEventStatus(
    start?: Timestamp,
    end?: Timestamp
  ): 'A venir' | 'En cours' | 'Passé' {

    if (!start || !end) {
      return 'A venir'; // fallback sûr
    }

    const now = Date.now();
    const startDate = start.toDate().getTime();
    const endDate = end.toDate().getTime();

    if (now < startDate) return 'A venir';
    if (now <= endDate) return 'En cours';
    return 'Passé';
  }

}
