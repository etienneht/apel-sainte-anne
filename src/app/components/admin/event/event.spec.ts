import { ComponentFixture, TestBed } from '@angular/core/testing';
import {ActivatedRoute, Router} from '@angular/router';
import { of } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';
import { AdminEventsComponent } from './event';
import { AuthService } from '../../../services/auth.service';
import { EventService } from '../../../services/event.service';
import { ImageService } from '../../../services/image.service';
import {EventEmitter, NgZone} from '@angular/core';


const activatedRouteMock = {
  snapshot: {
    paramMap: {
      get: jest.fn(),
    },
  },
  params: of({}),
  queryParams: of({}),
  data: of({}),
};
/* =========================
   NgZone MOCK COMPLET
   ========================= */

class NgZoneMock implements NgZone {
  runTask<T>(fn: (...args: any[]) => T, applyThis?: any, applyArgs?: any[], name?: string): T {
      throw new Error("Method not implemented.");
  }
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
}

/* =========================
   MOCK SERVICES
   ========================= */

const authServiceMock = {
  signOut: jest.fn(),
};

const routerMock = {
  navigate: jest.fn(),
  events: of(),
};

const eventServiceMock = {
  getEvents: jest.fn(),
  addEvent: jest.fn(),
  updateEvent: jest.fn(),
  deleteEvent: jest.fn(),
};

const imageServiceMock = {
  compressAndConvertToWebP: jest.fn(),
};

/* =========================
   TESTS
   ========================= */

describe('AdminEventsComponent', () => {
  let component: AdminEventsComponent;
  let fixture: ComponentFixture<AdminEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEventsComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: NgZone, useClass: NgZoneMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: EventService, useValue: eventServiceMock },
        { provide: ImageService, useValue: imageServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminEventsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* =========================
     BASIC
     ========================= */

  it('doit être créé', () => {
    expect(component).toBeTruthy();
  });

  /* =========================
     ngOnInit
     ========================= */

  it('doit charger les événements au init', () => {
    const eventsMock = [
      {
        id: '1',
        title: 'Event test',
        startDate: Timestamp.fromDate(new Date(Date.now() + 10000)),
        endDate: Timestamp.fromDate(new Date(Date.now() + 20000)),
        imageUrl: 'img.jpg',
      },
    ];

    eventServiceMock.getEvents.mockReturnValue(of(eventsMock));

    component.ngOnInit();

    expect(eventServiceMock.getEvents).toHaveBeenCalled();
    expect(component.events.length).toBe(1);
    expect(component.isLoading).toBe(false);
  });

  /* =========================
     logout
     ========================= */

  it('doit se déconnecter et rediriger', () => {
    component.logout();

    expect(authServiceMock.signOut).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  /* =========================
     toggle / reset
     ========================= */

  it('doit afficher et cacher le formulaire', () => {
    expect(component.isFormVisible).toBe(false);

    component.toggleForm();
    expect(component.isFormVisible).toBe(true);

    component.toggleForm();
    expect(component.isFormVisible).toBe(false);
  });

  it('doit reset le formulaire', () => {
    component.event.title = 'Test';
    component.isEditing = true;
    component.isFormVisible = true;

    component.resetForm();

    expect(component.event.title).toBe('');
    expect(component.isEditing).toBe(false);
    expect(component.isFormVisible).toBe(false);
  });

  /* =========================
     onEdit
     ========================= */

  it('doit passer en mode édition', () => {
    const event = {
      id: '1',
      title: 'Event',
      description: 'desc',
      startDate: Timestamp.now(),
      endDate: Timestamp.now(),
      imageUrl: 'img.jpg',
    } as any;

    component.onEdit(event);

    expect(component.isEditing).toBe(true);
    expect(component.editingEventId).toBe('1');
    expect(component.event.title).toBe('Event');
  });

  /* =========================
     onDelete
     ========================= */

  it('doit supprimer un événement après confirmation', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    eventServiceMock.deleteEvent.mockResolvedValue(undefined);

    component.onDelete({
      id: '1',
      title: 'Event',
      imageUrl: 'img.jpg',
    } as any);

    expect(eventServiceMock.deleteEvent).toHaveBeenCalledWith('1', 'img.jpg');
  });

  /* =========================
     onDuplicate
     ========================= */

  it('doit dupliquer un événement', () => {
    eventServiceMock.addEvent.mockReturnValue(of(undefined));

    const event = {
      title: 'Event',
      startDate: Timestamp.now(),
      endDate: Timestamp.now(),
      imageUrl: 'img.jpg',
    } as any;

    component.onDuplicate(event);

    expect(eventServiceMock.addEvent).toHaveBeenCalled();
  });

  /* =========================
     getEventStatus
     ========================= */

  it('doit retourner "A venir"', () => {
    const start = Timestamp.fromDate(new Date(Date.now() + 100000));
    const end = Timestamp.fromDate(new Date(Date.now() + 200000));

    expect(component.getEventStatus(start, end)).toBe('A venir');
  });

  it('doit retourner "En cours"', () => {
    const start = Timestamp.fromDate(new Date(Date.now() - 10000));
    const end = Timestamp.fromDate(new Date(Date.now() + 10000));

    expect(component.getEventStatus(start, end)).toBe('En cours');
  });

  it('doit retourner "Passé"', () => {
    const start = Timestamp.fromDate(new Date(Date.now() - 20000));
    const end = Timestamp.fromDate(new Date(Date.now() - 10000));

    expect(component.getEventStatus(start, end)).toBe('Passé');
  });
});
