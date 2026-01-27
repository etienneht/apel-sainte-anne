import {Component, NgZone} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { Router, RouterLink } from '@angular/router';
import {editorConfig} from '../../../config/tinymce-editor-config';
import { FlatpickrDirective } from 'angularx-flatpickr';
import { Subject } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';
import { French } from 'flatpickr/dist/l10n/fr';
import {AuthService} from '../../../services/auth.service';
import {EventService} from '../../../services/event.service';
import {ImageService} from '../../../services/image.service';
import {EventData} from '../../../models/event.model';


@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule, EditorModule, FlatpickrDirective, RouterLink],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class AdminEventsComponent {
  events: EventData[] = [];
  event: Partial<EventData> = { title: '' };
  selectedFile: File | null = null; // Fichier d'origine
  optimizedFile: File | null = null; // Fichier optimisé
  isLoading = true;
  isEditing: boolean = false;
  editingEventId: string | null = null;
  selectedImage: string | ArrayBuffer | null = null;
  isFormVisible: boolean = false;
  refresh = new Subject<void>();
  isSubmitting = false;

  constructor( private authService: AuthService, private zone: NgZone, private router: Router, private eventService: EventService, private imageService: ImageService)  {}


  editorConfig = editorConfig;
  flatpickrOptions = {
    locale: French, // Définir la langue en français
    enableTime: true, // Permet de sélectionner une heure
    dateFormat: "Y-m-dTH:i", // Format de la date
    altInput: true,
    altFormat: "d F Y H:i", // Affichage lisible en français
    time24hr:true
  };

  ngOnInit(): void {
    this.eventService.getEvents().subscribe({
      next: (events: EventData[]) => {
        this.zone.run(() => {
          this.events = events.map(event => ({
            ...event,
            status: this.getEventStatus(event.startDate, event.endDate)
          }));
          this.isLoading = false;
        });
      },
      error: (err: any) => {
        this.zone.run(() => {
          console.error('Erreur lors de la récupération des events:', err);
          this.isLoading = false;
        });
      },
    });
  }



  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {

      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) { // Limite de 5 Mo
        alert('Le fichier est trop volumineux (max 5 Mo).');
        return;
      }
      // Valider le type de fichier
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Seuls les fichiers JPEG, PNG ou WebP sont acceptés.');
        return;
      }

      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
      };
      reader.readAsDataURL(file);

      try {
        // Compresser et convertir l'image en WebP
        this.optimizedFile = await this.imageService.compressAndConvertToWebP(file);
        console.log('Fichier optimisé :', this.optimizedFile);
      } catch (error) {
        console.error('Erreur lors du traitement de l’image :', error);
      }
    }
  }
  logout(){
    this.authService.signOut();
    this.router.navigate(['/']);
  }

  onSubmit(): void {
    if (!this.event.title) {
      alert('Veuillez saisir un titre.');
      return;
    }

    if (!this.event.description || this.event.description.trim() === '') {
      alert('Veuillez saisir une description');
      return;
    }

    if (!this.event.startDate) {
      alert("Veuillez saisir une date de début");
      return;
    }

    if (!this.event.endDate) {
      alert("Veuillez saisir une date de fin");
      return;
    }

    if (!this.event.imageUrl && !this.selectedFile) {
      alert("Veuillez ajouter une image de couverture");
      return;
    }

    this.isSubmitting = true;

    const startDate = this.event.startDate instanceof Timestamp
      ? this.event.startDate
      : Timestamp.fromDate(new Date(this.event.startDate));

    const endDate = this.event.endDate instanceof Timestamp
      ? this.event.endDate
      : Timestamp.fromDate(new Date(this.event.endDate));

    const status = this.getEventStatus(startDate, endDate);

    if (this.isEditing && this.editingEventId) {
      const imageToUpload = this.optimizedFile || undefined;

      this.eventService
        .updateEvent(
          this.editingEventId,
          {
            title: this.event.title,
            description: this.event.description || '',
            startDate,
            endDate,
            status,
            location: this.event.location || '',
            socialLink: this.event.socialLink || '',
            paymentLink: this.event.paymentLink || '',
          },
          imageToUpload,
          this.event.imageUrl
        )
        .then(() => {
          console.log('Événement mis à jour');
          this.resetForm();
        })
        .catch((error: any) => {
          console.error('Erreur lors de la mise à jour de l\'événement :', error);
        })
        .finally(() => (this.isSubmitting = false));

    } else {
      // Ajouter un nouvel événement
      if (this.optimizedFile) {
        const newEvent: EventData = {
          title: this.event.title!,
          description: this.event.description || '',
          imageUrl: '',
          startDate,
          endDate,
          status,
          location: this.event.location || '',
          socialLink: this.event.socialLink || '',
          paymentLink: this.event.paymentLink || '',
        };

        this.eventService.addEvent(newEvent, this.optimizedFile).subscribe(() => {
          console.log('Nouvel événement ajouté');
          this.isSubmitting = false;
          this.resetForm();
        });
      }
    }
  }




  onEdit(event: EventData): void {
    this.event = {
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      socialLink: event.socialLink,
      paymentLink: event.paymentLink,
      imageUrl: event.imageUrl,
    };

    this.editingEventId = event.id!;
    this.isEditing = true;

    this.selectedFile = null;
    this.optimizedFile = null;
  }


  onDelete(event: EventData): void {
    if (event.id && event.imageUrl) {
      const confirmation = confirm(
        `Êtes-vous sûr de vouloir supprimer le event "${event.title}" ?`
      );
      if (confirmation) {
        this.eventService.deleteEvent(event.id, event.imageUrl).then(() => {
          console.log('event supprimé');
        });
      }
    }
  }

  resetForm(): void {
    this.event = { title: '' };
    this.selectedFile = null;
    this.optimizedFile = null;
    this.isEditing = false;
    this.editingEventId = null;
    this.toggleForm();
  }

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDuplicate(event: EventData): void {
    const duplicatedEvent: EventData = {
      ...event,
      title: event.title + " (copie)",
      startDate: event.startDate instanceof Timestamp
        ? event.startDate
        : Timestamp.fromDate(new Date(event.startDate)),

      imageUrl: event.imageUrl, // Garde la même image
    };

    this.eventService.addEvent(duplicatedEvent, undefined).subscribe(() => {
      console.log('Événement dupliqué');
    });
  }

  getEventStatus(start: Timestamp, end: Timestamp): 'A venir' | 'En cours' | 'Passé' {
    const now = new Date().getTime();
    const startDate = start.toDate().getTime();
    const endDate = end.toDate().getTime();

    if (now < startDate) {
      return 'A venir';
    }

    if (now >= startDate && now <= endDate) {
      return 'En cours';
    }

    return 'Passé';
  }

}
