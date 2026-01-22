import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageServices } from './homepage-services';

describe('HomepageServices', () => {
  let component: HomepageServices;
  let fixture: ComponentFixture<HomepageServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageServices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
