import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TrackedHabitDetailComponent } from './tracked-habit-detail.component';

describe('TrackedHabit Management Detail Component', () => {
  let comp: TrackedHabitDetailComponent;
  let fixture: ComponentFixture<TrackedHabitDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrackedHabitDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ trackedHabit: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TrackedHabitDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TrackedHabitDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load trackedHabit on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.trackedHabit).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
