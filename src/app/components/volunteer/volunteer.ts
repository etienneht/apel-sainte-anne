import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NeedCard } from '../need-card/need-card';

@Component({
  selector: 'app-volunteer',
  standalone: true,
  imports: [CommonModule, NeedCard],
  templateUrl: './volunteer.html',
  styleUrl: './volunteer.css',
})
export class Volunteer {
 // données test pour tester l'affichage
  needs = [
    {
      id: 1,
      title: 'Tenue de stand kermesse',
      description: 'Aider à la caisse et au rangement.',
      requiredVolunteers: 3,
      startAt: '2026-01-20 14:00',
      endAt: '2026-01-20 18:00',
    },
    {
      id: 2,
      title: 'Installation salle',
      description: 'Mettre en place tables/chaises avant l’événement.',
      requiredVolunteers: 2,
      startAt: '2026-01-22 09:00',
      endAt: '2026-01-22 11:00',
    },
  ];

  onVolunteer(needId: number) {
    alert(`Inscription envoyée pour le besoin #${needId} (pending)`);
  }
}