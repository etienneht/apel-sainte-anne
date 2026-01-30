import { EventService } from './event.service';
import { firstValueFrom, of } from 'rxjs';

/* =========================
   MOCKS ANGULARFIRE
   ========================= */

jest.mock('@angular/fire/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  collectionData: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
}));

jest.mock('@angular/fire/storage', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
  deleteObject: jest.fn(),
}));

import * as FirestoreApi from '@angular/fire/firestore';
import * as StorageApi from '@angular/fire/storage';

/* =========================
   TESTS
   ========================= */

describe('EventService', () => {
  let service: EventService;

  beforeEach(() => {
    jest.clearAllMocks();

    // Instanciation MANUELLE (pas de TestBed)
    service = new EventService(
      {} as any, // Firestore mock
      {} as any  // Storage mock
    );
  });

  it('doit être créé', () => {
    expect(service).toBeTruthy();
  });

  /* =========================
     addEvent
     ========================= */

  describe('addEvent', () => {
    it('doit ajouter un événement sans image', async () => {
      (FirestoreApi.addDoc as jest.Mock).mockResolvedValue(undefined);

      const event = { title: 'Event sans image' } as any;

      await firstValueFrom(service.addEvent(event));

      expect(FirestoreApi.addDoc).toHaveBeenCalled();
    });

    it('doit ajouter un événement avec image', async () => {
      (StorageApi.uploadBytes as jest.Mock).mockResolvedValue(undefined);
      (StorageApi.getDownloadURL as jest.Mock).mockResolvedValue('http://image.url');
      (FirestoreApi.addDoc as jest.Mock).mockResolvedValue(undefined);

      const event = { title: 'Event avec image' } as any;
      const file = new File(['image'], 'image.png');

      await firstValueFrom(service.addEvent(event, file));

      expect(StorageApi.uploadBytes).toHaveBeenCalled();
      expect(StorageApi.getDownloadURL).toHaveBeenCalled();
      expect(FirestoreApi.addDoc).toHaveBeenCalled();
      expect(event.imageUrl).toBe('http://image.url');
    });

    it('doit remonter une erreur si Firebase échoue', async () => {
      (FirestoreApi.addDoc as jest.Mock).mockRejectedValue(
        new Error('Erreur Firebase')
      );

      const event = { title: 'Event erreur' } as any;

      await expect(
        firstValueFrom(service.addEvent(event))
      ).rejects.toThrow('Erreur Firebase');
    });
  });

  /* =========================
     getEvents
     ========================= */

  describe('getEvents', () => {
    it('doit retourner la liste des événements', async () => {
      const events = [{ title: 'Event 1' }];
      (FirestoreApi.collectionData as jest.Mock).mockReturnValue(of(events));

      const result = await firstValueFrom(service.getEvents());

      expect(result).toEqual(events);
    });
  });

  /* =========================
     updateEvent
     ========================= */

  describe('updateEvent', () => {
    it('doit mettre à jour un événement sans image', async () => {
      (FirestoreApi.updateDoc as jest.Mock).mockResolvedValue(undefined);

      await service.updateEvent('1', { title: 'Nouveau titre' });

      expect(FirestoreApi.updateDoc).toHaveBeenCalled();
    });

    it('doit mettre à jour un événement avec image', async () => {
      (StorageApi.uploadBytes as jest.Mock).mockResolvedValue(undefined);
      (StorageApi.getDownloadURL as jest.Mock).mockResolvedValue('http://new.image');
      (StorageApi.deleteObject as jest.Mock).mockResolvedValue(undefined);
      (FirestoreApi.updateDoc as jest.Mock).mockResolvedValue(undefined);

      const file = new File(['image'], 'image.png');

      await service.updateEvent(
        '1',
        { title: 'Event' },
        file,
        'http://old.image'
      );

      expect(StorageApi.deleteObject).toHaveBeenCalled();
      expect(StorageApi.uploadBytes).toHaveBeenCalled();
      expect(FirestoreApi.updateDoc).toHaveBeenCalled();
    });
  });

  /* =========================
     deleteEvent
     ========================= */

  describe('deleteEvent', () => {
    it('doit supprimer un événement sans image', async () => {
      (FirestoreApi.deleteDoc as jest.Mock).mockResolvedValue(undefined);

      await service.deleteEvent('1');

      expect(FirestoreApi.deleteDoc).toHaveBeenCalled();
    });

    it('doit supprimer un événement avec image', async () => {
      (StorageApi.deleteObject as jest.Mock).mockResolvedValue(undefined);
      (FirestoreApi.deleteDoc as jest.Mock).mockResolvedValue(undefined);

      await service.deleteEvent('1', 'http://image.url');

      expect(StorageApi.deleteObject).toHaveBeenCalled();
      expect(FirestoreApi.deleteDoc).toHaveBeenCalled();
    });
  });
});
