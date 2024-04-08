import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../tracked-habit.test-samples';

import { TrackedHabitFormService } from './tracked-habit-form.service';

describe('TrackedHabit Form Service', () => {
  let service: TrackedHabitFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackedHabitFormService);
  });

  describe('Service methods', () => {
    describe('createTrackedHabitFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTrackedHabitFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            completed: expect.any(Object),
            trackedHabitID: expect.any(Object),
            rel1: expect.any(Object),
            rel2: expect.any(Object),
          })
        );
      });

      it('passing ITrackedHabit should create a new form with FormGroup', () => {
        const formGroup = service.createTrackedHabitFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            completed: expect.any(Object),
            trackedHabitID: expect.any(Object),
            rel1: expect.any(Object),
            rel2: expect.any(Object),
          })
        );
      });
    });

    describe('getTrackedHabit', () => {
      it('should return NewTrackedHabit for default TrackedHabit initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTrackedHabitFormGroup(sampleWithNewData);

        const trackedHabit = service.getTrackedHabit(formGroup) as any;

        expect(trackedHabit).toMatchObject(sampleWithNewData);
      });

      it('should return NewTrackedHabit for empty TrackedHabit initial value', () => {
        const formGroup = service.createTrackedHabitFormGroup();

        const trackedHabit = service.getTrackedHabit(formGroup) as any;

        expect(trackedHabit).toMatchObject({});
      });

      it('should return ITrackedHabit', () => {
        const formGroup = service.createTrackedHabitFormGroup(sampleWithRequiredData);

        const trackedHabit = service.getTrackedHabit(formGroup) as any;

        expect(trackedHabit).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITrackedHabit should not enable id FormControl', () => {
        const formGroup = service.createTrackedHabitFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTrackedHabit should disable id FormControl', () => {
        const formGroup = service.createTrackedHabitFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
