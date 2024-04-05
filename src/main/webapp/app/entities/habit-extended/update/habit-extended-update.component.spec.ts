import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { HabitExtendedFormService } from './habit-extended-form.service';
import { HabitExtendedService } from '../service/habit-extended.service';
import { IHabitExtended } from '../habit-extended.model';
import { INewWeeklyHabitTracker } from 'app/entities/new-weekly-habit-tracker/new-weekly-habit-tracker.model';
import { NewWeeklyHabitTrackerService } from 'app/entities/new-weekly-habit-tracker/service/new-weekly-habit-tracker.service';

import { HabitExtendedUpdateComponent } from './habit-extended-update.component';

describe('HabitExtended Management Update Component', () => {
  let comp: HabitExtendedUpdateComponent;
  let fixture: ComponentFixture<HabitExtendedUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let habitExtendedFormService: HabitExtendedFormService;
  let habitExtendedService: HabitExtendedService;
  let newWeeklyHabitTrackerService: NewWeeklyHabitTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [HabitExtendedUpdateComponent],
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
      .overrideTemplate(HabitExtendedUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HabitExtendedUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    habitExtendedFormService = TestBed.inject(HabitExtendedFormService);
    habitExtendedService = TestBed.inject(HabitExtendedService);
    newWeeklyHabitTrackerService = TestBed.inject(NewWeeklyHabitTrackerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call NewWeeklyHabitTracker query and add missing value', () => {
      const habitExtended: IHabitExtended = { id: 456 };
      const rel1: INewWeeklyHabitTracker = { id: 69757 };
      habitExtended.rel1 = rel1;

      const newWeeklyHabitTrackerCollection: INewWeeklyHabitTracker[] = [{ id: 21373 }];
      jest.spyOn(newWeeklyHabitTrackerService, 'query').mockReturnValue(of(new HttpResponse({ body: newWeeklyHabitTrackerCollection })));
      const additionalNewWeeklyHabitTrackers = [rel1];
      const expectedCollection: INewWeeklyHabitTracker[] = [...additionalNewWeeklyHabitTrackers, ...newWeeklyHabitTrackerCollection];
      jest.spyOn(newWeeklyHabitTrackerService, 'addNewWeeklyHabitTrackerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ habitExtended });
      comp.ngOnInit();

      expect(newWeeklyHabitTrackerService.query).toHaveBeenCalled();
      expect(newWeeklyHabitTrackerService.addNewWeeklyHabitTrackerToCollectionIfMissing).toHaveBeenCalledWith(
        newWeeklyHabitTrackerCollection,
        ...additionalNewWeeklyHabitTrackers.map(expect.objectContaining)
      );
      expect(comp.newWeeklyHabitTrackersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const habitExtended: IHabitExtended = { id: 456 };
      const rel1: INewWeeklyHabitTracker = { id: 93959 };
      habitExtended.rel1 = rel1;

      activatedRoute.data = of({ habitExtended });
      comp.ngOnInit();

      expect(comp.newWeeklyHabitTrackersSharedCollection).toContain(rel1);
      expect(comp.habitExtended).toEqual(habitExtended);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHabitExtended>>();
      const habitExtended = { id: 123 };
      jest.spyOn(habitExtendedFormService, 'getHabitExtended').mockReturnValue(habitExtended);
      jest.spyOn(habitExtendedService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ habitExtended });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: habitExtended }));
      saveSubject.complete();

      // THEN
      expect(habitExtendedFormService.getHabitExtended).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(habitExtendedService.update).toHaveBeenCalledWith(expect.objectContaining(habitExtended));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHabitExtended>>();
      const habitExtended = { id: 123 };
      jest.spyOn(habitExtendedFormService, 'getHabitExtended').mockReturnValue({ id: null });
      jest.spyOn(habitExtendedService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ habitExtended: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: habitExtended }));
      saveSubject.complete();

      // THEN
      expect(habitExtendedFormService.getHabitExtended).toHaveBeenCalled();
      expect(habitExtendedService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHabitExtended>>();
      const habitExtended = { id: 123 };
      jest.spyOn(habitExtendedService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ habitExtended });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(habitExtendedService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
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
