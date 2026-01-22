import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageBanner } from './homepage-banner';

describe('HomepageBanner', () => {
  let component: HomepageBanner;
  let fixture: ComponentFixture<HomepageBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageBanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
