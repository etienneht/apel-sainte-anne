import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';
import { Observable } from 'rxjs';
import {EventData} from '../models/event.model';



@Injectable({
  providedIn: 'root'
})
export class EventService {
private readonly collectionPath = 'events';

  constructor(private firestore: Firestore, private storage: Storage) {}


  // Ajouter un event
  addEvent(event: EventData, imageFile?: File): Observable<void> { // <-- Rend imageFile optionnel
    if (imageFile) {
      const filePath = `images/events/${Date.now()}_${imageFile.name}`;
      const fileRef = ref(this.storage, filePath);

      return new Observable((observer) => {
        uploadBytes(fileRef, imageFile)
          .then(() => getDownloadURL(fileRef))
          .then((url) => {
            event.imageUrl = url;
            const eventCollection = collection(this.firestore, this.collectionPath);
            return addDoc(eventCollection, event);
          })
          .then(() => {
            observer.next();
            observer.complete();
          })
          .catch((err) => {
            console.error("Erreur lors de l’ajout de l'événement :", err);
            observer.error(err);
          });
      });
    } else {
      // Si pas d'image, ajouter directement l'événement
      const eventCollection = collection(this.firestore, this.collectionPath);
      return new Observable((observer) => {
        addDoc(eventCollection, event)
          .then(() => {
            observer.next();
            observer.complete();
          })
          .catch((err) => {
            console.error("Erreur lors de l’ajout de l'événement :", err);
            observer.error(err);
          });
      });
    }
  }



  // Récupérer tous les events
  getEvents(): Observable<EventData[]> {
    const eventCollection = collection(this.firestore, this.collectionPath);
    return collectionData(eventCollection, { idField: 'id' }) as Observable<EventData[]>;
  }

  // Mettre à jour un event avec ou sans remplacement de l'image
  updateEvent(
    id: string,
    event: Partial<EventData>,
    imageFile?: File,
    oldImageUrl?: string
  ): Promise<void> {
    const eventDoc = doc(this.firestore, `${this.collectionPath}/${id}`);

    if (imageFile) {
      const filePath = `images/events/${Date.now()}_${imageFile.name}`;
      const fileRef = ref(this.storage, filePath);

      const deleteOldImage = oldImageUrl
        ? deleteObject(ref(this.storage, oldImageUrl)).catch((err) => {
            console.warn("Erreur lors de la suppression de l’ancienne image :", err);
            return Promise.resolve();
          })
        : Promise.resolve();

      return deleteOldImage
        .then(() => uploadBytes(fileRef, imageFile))
        .then(() => getDownloadURL(fileRef))
        .then((url) => {
          event.imageUrl = url;
          return updateDoc(eventDoc, event);
        })
        .catch((err) => {
          console.error("Erreur lors de la mise à jour de l'événement :", err);
          throw err;
        });
    }

    return updateDoc(eventDoc, event).catch((err) => {
      console.error("Erreur lors de la mise à jour de l'événement :", err);
      throw err;
    });
  }



  // Supprimer un event
  deleteEvent(id: string, imageUrl?: string): Promise<void> {
    const eventDoc = doc(this.firestore, `${this.collectionPath}/${id}`);

    const deleteImage = imageUrl
      ? deleteObject(ref(this.storage, imageUrl)).catch((err) => {
          console.warn('Erreur lors de la suppression de l’image :', err);
          return Promise.resolve(); // Continuer même si l'image n'a pas pu être supprimée
        })
      : Promise.resolve();

    return deleteImage
      .then(() => deleteDoc(eventDoc))
      .catch((err) => {
        console.error('Erreur lors de la suppression du event :', err);
        throw err;
      });
  }


}
