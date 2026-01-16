import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedCard } from './need-card';

describe('NeedCard', () => {
  let component: NeedCard;
  let fixture: ComponentFixture<NeedCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeedCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeedCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
