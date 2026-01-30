import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';
import { AdminEventsComponent } from './event';
import { AuthService } from '../../../services/auth.service';
import { EventService } from '../../../services/event.service';
import { ImageService } from '../../../services/image.service';
import { EventEmitter, NgZone } from '@angular/core';

beforeAll(() => {
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  (window.alert as jest.Mock).mockRestore();
  (console.error as jest.Mock).mockRestore();
});

/* =========================
   NgZone MOCK
========================= */
class NgZoneMock implements NgZone {
  hasPendingMicrotasks = false;
  hasPendingMacrotasks = false;
  isStable = true;

  onUnstable = new EventEmitter<void>();
  onMicrotaskEmpty = new EventEmitter<void>();
  onStable = new EventEmitter<void>();
  onError = new EventEmitter<any>();

  run<T>(fn: (...args: any[]) => T): T {
    return fn();
  }
  runGuarded<T>(fn: (...args: any[]) => T): T {
    return fn();
  }
  runOutsideAngular<T>(fn: (...args: any[]) => T): T {
    return fn();
  }
  runTask<T>(fn: (...args: any[]) => T): T {
    return fn();
  }
}

/* =========================
   MOCKS
========================= */

const eventServiceMock = {
  getEvents: jest.fn(),
  addEvent: jest.fn(),
  updateEvent: jest.fn(),
  deleteEvent: jest.fn(),
};

const imageServiceMock = {
  compressAndConvertToWebP: jest.fn(),
};

describe('AdminEventsComponent', () => {
  let component: AdminEventsComponent;
  let fixture: ComponentFixture<AdminEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEventsComponent],
      providers: [
        { provide: Router, useValue: { navigate: jest.fn(), events: of() } },
        { provide: NgZone, useClass: NgZoneMock },
        { provide: AuthService, useValue: { signOut: jest.fn() } },
        { provide: EventService, useValue: eventServiceMock },
        { provide: ImageService, useValue: imageServiceMock },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminEventsComponent);
    component = fixture.componentInstance;

    component.event = {
      title: 'Event test',
      description: 'Description',
      startDate: Timestamp.now(),
      endDate: Timestamp.now(),
      imageUrl: 'img.jpg',
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* =========================
     onSubmit - création
  ========================= */

  it('doit créer un événement si optimizedFile existe', () => {
    const file = new File(['img'], 'test.webp');
    component.optimizedFile = file;

    eventServiceMock.addEvent.mockReturnValue(of(undefined));

    component.onSubmit();

    expect(eventServiceMock.addEvent).toHaveBeenCalled();
  });

  it('ne doit PAS créer un événement sans optimizedFile', () => {
    component.optimizedFile = null;

    component.onSubmit();

    expect(eventServiceMock.addEvent).not.toHaveBeenCalled();
  });

  /* =========================
     onSubmit - édition
  ========================= */

  it('doit mettre à jour un événement en mode édition', async () => {
    component.isEditing = true;
    component.editingEventId = '123';

    eventServiceMock.updateEvent.mockResolvedValue(undefined);

    component.onSubmit();

    expect(eventServiceMock.updateEvent).toHaveBeenCalledWith(
      '123',
      expect.objectContaining({ title: 'Event test' }),
      undefined,
      'img.jpg'
    );
  });

  /* =========================
     gestion erreur
  ========================= */

  it('ne doit pas planter si addEvent échoue', () => {
    component.optimizedFile = new File(['img'], 'test.webp');

    eventServiceMock.addEvent.mockReturnValue(
      throwError(() => new Error('Erreur Firebase'))
    );

    expect(() => component.onSubmit()).not.toThrow();
  });

  /* =========================
     image compression
  ========================= */

  it('doit compresser une image via onFileSelected', async () => {
    const file = new File(['img'], 'test.png', { type: 'image/png' });
    imageServiceMock.compressAndConvertToWebP.mockResolvedValue(file);

    const input = document.createElement('input');
    Object.defineProperty(input, 'files', {
      value: [file],
    });

    await component.onFileSelected({ target: input } as any);

    expect(imageServiceMock.compressAndConvertToWebP).toHaveBeenCalledWith(file);
    expect(component.optimizedFile).toBe(file);
  });
});
