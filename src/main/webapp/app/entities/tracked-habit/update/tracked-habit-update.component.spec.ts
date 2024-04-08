import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TrackedHabitFormService } from './tracked-habit-form.service';
import { TrackedHabitService } from '../service/tracked-habit.service';
import { ITrackedHabit } from '../tracked-habit.model';
import { IHabit } from 'app/entities/habit/habit.model';
import { HabitService } from 'app/entities/habit/service/habit.service';
import { INewWeeklyHabitTracker } from 'app/entities/new-weekly-habit-tracker/new-weekly-habit-tracker.model';
import { NewWeeklyHabitTrackerService } from 'app/entities/new-weekly-habit-tracker/service/new-weekly-habit-tracker.service';

import { TrackedHabitUpdateComponent } from './tracked-habit-update.component';

describe('TrackedHabit Management Update Component', () => {
  let comp: TrackedHabitUpdateComponent;
  let fixture: ComponentFixture<TrackedHabitUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let trackedHabitFormService: TrackedHabitFormService;
  let trackedHabitService: TrackedHabitService;
  let habitService: HabitService;
  let newWeeklyHabitTrackerService: NewWeeklyHabitTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TrackedHabitUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TrackedHabitUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TrackedHabitUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    trackedHabitFormService = TestBed.inject(TrackedHabitFormService);
    trackedHabitService = TestBed.inject(TrackedHabitService);
    habitService = TestBed.inject(HabitService);
    newWeeklyHabitTrackerService = TestBed.inject(NewWeeklyHabitTrackerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Habit query and add missing value', () => {
      const trackedHabit: ITrackedHabit = { id: 456 };
      const rel1: IHabit = { id: 54992 };
      trackedHabit.rel1 = rel1;

      const habitCollection: IHabit[] = [{ id: 91567 }];
      jest.spyOn(habitService, 'query').mockReturnValue(of(new HttpResponse({ body: habitCollection })));
      const additionalHabits = [rel1];
      const expectedCollection: IHabit[] = [...additionalHabits, ...habitCollection];
      jest.spyOn(habitService, 'addHabitToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ trackedHabit });
      comp.ngOnInit();

      expect(habitService.query).toHaveBeenCalled();
      expect(habitService.addHabitToCollectionIfMissing).toHaveBeenCalledWith(
        habitCollection,
        ...additionalHabits.map(expect.objectContaining)
      );
      expect(comp.habitsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call NewWeeklyHabitTracker query and add missing value', () => {
      const trackedHabit: ITrackedHabit = { id: 456 };
      const rel2: INewWeeklyHabitTracker = { id: 37942 };
      trackedHabit.rel2 = rel2;

      const newWeeklyHabitTrackerCollection: INewWeeklyHabitTracker[] = [{ id: 9843 }];
      jest.spyOn(newWeeklyHabitTrackerService, 'query').mockReturnValue(of(new HttpResponse({ body: newWeeklyHabitTrackerCollection })));
      const additionalNewWeeklyHabitTrackers = [rel2];
      const expectedCollection: INewWeeklyHabitTracker[] = [...additionalNewWeeklyHabitTrackers, ...newWeeklyHabitTrackerCollection];
      jest.spyOn(newWeeklyHabitTrackerService, 'addNewWeeklyHabitTrackerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ trackedHabit });
      comp.ngOnInit();

      expect(newWeeklyHabitTrackerService.query).toHaveBeenCalled();
      expect(newWeeklyHabitTrackerService.addNewWeeklyHabitTrackerToCollectionIfMissing).toHaveBeenCalledWith(
        newWeeklyHabitTrackerCollection,
        ...additionalNewWeeklyHabitTrackers.map(expect.objectContaining)
      );
      expect(comp.newWeeklyHabitTrackersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const trackedHabit: ITrackedHabit = { id: 456 };
      const rel1: IHabit = { id: 24089 };
      trackedHabit.rel1 = rel1;
      const rel2: INewWeeklyHabitTracker = { id: 34486 };
      trackedHabit.rel2 = rel2;

      activatedRoute.data = of({ trackedHabit });
      comp.ngOnInit();

      expect(comp.habitsSharedCollection).toContain(rel1);
      expect(comp.newWeeklyHabitTrackersSharedCollection).toContain(rel2);
      expect(comp.trackedHabit).toEqual(trackedHabit);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITrackedHabit>>();
      const trackedHabit = { id: 123 };
      jest.spyOn(trackedHabitFormService, 'getTrackedHabit').mockReturnValue(trackedHabit);
      jest.spyOn(trackedHabitService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ trackedHabit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: trackedHabit }));
      saveSubject.complete();

      // THEN
      expect(trackedHabitFormService.getTrackedHabit).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(trackedHabitService.update).toHaveBeenCalledWith(expect.objectContaining(trackedHabit));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITrackedHabit>>();
      const trackedHabit = { id: 123 };
      jest.spyOn(trackedHabitFormService, 'getTrackedHabit').mockReturnValue({ id: null });
      jest.spyOn(trackedHabitService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ trackedHabit: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: trackedHabit }));
      saveSubject.complete();

      // THEN
      expect(trackedHabitFormService.getTrackedHabit).toHaveBeenCalled();
      expect(trackedHabitService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITrackedHabit>>();
      const trackedHabit = { id: 123 };
      jest.spyOn(trackedHabitService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ trackedHabit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(trackedHabitService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareHabit', () => {
      it('Should forward to habitService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(habitService, 'compareHabit');
        comp.compareHabit(entity, entity2);
        expect(habitService.compareHabit).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareNewWeeklyHabitTracker', () => {
      it('Should forward to newWeeklyHabitTrackerService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(newWeeklyHabitTrackerService, 'compareNewWeeklyHabitTracker');
        comp.compareNewWeeklyHabitTracker(entity, entity2);
        expect(newWeeklyHabitTrackerService.compareNewWeeklyHabitTracker).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
