import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../habit-extended.test-samples';

import { HabitExtendedFormService } from './habit-extended-form.service';

describe('HabitExtended Form Service', () => {
  let service: HabitExtendedFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HabitExtendedFormService);
  });

  describe('Service methods', () => {
    describe('createHabitExtendedFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createHabitExtendedFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            habitExtendedID: expect.any(Object),
            habitExtendedName: expect.any(Object),
            habitCompletionCheckbox: expect.any(Object),
            habitDate: expect.any(Object),
            rel1: expect.any(Object),
          })
        );
      });

      it('passing IHabitExtended should create a new form with FormGroup', () => {
        const formGroup = service.createHabitExtendedFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            habitExtendedID: expect.any(Object),
            habitExtendedName: expect.any(Object),
            habitCompletionCheckbox: expect.any(Object),
            habitDate: expect.any(Object),
            rel1: expect.any(Object),
          })
        );
      });
    });

    describe('getHabitExtended', () => {
      it('should return NewHabitExtended for default HabitExtended initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createHabitExtendedFormGroup(sampleWithNewData);

        const habitExtended = service.getHabitExtended(formGroup) as any;

        expect(habitExtended).toMatchObject(sampleWithNewData);
      });

      it('should return NewHabitExtended for empty HabitExtended initial value', () => {
        const formGroup = service.createHabitExtendedFormGroup();

        const habitExtended = service.getHabitExtended(formGroup) as any;

        expect(habitExtended).toMatchObject({});
      });

      it('should return IHabitExtended', () => {
        const formGroup = service.createHabitExtendedFormGroup(sampleWithRequiredData);

        const habitExtended = service.getHabitExtended(formGroup) as any;

        expect(habitExtended).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IHabitExtended should not enable id FormControl', () => {
        const formGroup = service.createHabitExtendedFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewHabitExtended should disable id FormControl', () => {
        const formGroup = service.createHabitExtendedFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
