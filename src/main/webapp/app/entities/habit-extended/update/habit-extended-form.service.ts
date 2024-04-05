import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IHabitExtended, NewHabitExtended } from '../habit-extended.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IHabitExtended for edit and NewHabitExtendedFormGroupInput for create.
 */
type HabitExtendedFormGroupInput = IHabitExtended | PartialWithRequiredKeyOf<NewHabitExtended>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IHabitExtended | NewHabitExtended> = Omit<T, 'habitDate'> & {
  habitDate?: string | null;
};

type HabitExtendedFormRawValue = FormValueOf<IHabitExtended>;

type NewHabitExtendedFormRawValue = FormValueOf<NewHabitExtended>;

type HabitExtendedFormDefaults = Pick<NewHabitExtended, 'id' | 'habitCompletionCheckbox' | 'habitDate'>;

type HabitExtendedFormGroupContent = {
  id: FormControl<HabitExtendedFormRawValue['id'] | NewHabitExtended['id']>;
  habitExtendedID: FormControl<HabitExtendedFormRawValue['habitExtendedID']>;
  habitExtendedName: FormControl<HabitExtendedFormRawValue['habitExtendedName']>;
  habitCompletionCheckbox: FormControl<HabitExtendedFormRawValue['habitCompletionCheckbox']>;
  habitDate: FormControl<HabitExtendedFormRawValue['habitDate']>;
  rel1: FormControl<HabitExtendedFormRawValue['rel1']>;
};

export type HabitExtendedFormGroup = FormGroup<HabitExtendedFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class HabitExtendedFormService {
  createHabitExtendedFormGroup(habitExtended: HabitExtendedFormGroupInput = { id: null }): HabitExtendedFormGroup {
    const habitExtendedRawValue = this.convertHabitExtendedToHabitExtendedRawValue({
      ...this.getFormDefaults(),
      ...habitExtended,
    });
    return new FormGroup<HabitExtendedFormGroupContent>({
      id: new FormControl(
        { value: habitExtendedRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      habitExtendedID: new FormControl(habitExtendedRawValue.habitExtendedID),
      habitExtendedName: new FormControl(habitExtendedRawValue.habitExtendedName),
      habitCompletionCheckbox: new FormControl(habitExtendedRawValue.habitCompletionCheckbox),
      habitDate: new FormControl(habitExtendedRawValue.habitDate),
      rel1: new FormControl(habitExtendedRawValue.rel1),
    });
  }

  getHabitExtended(form: HabitExtendedFormGroup): IHabitExtended | NewHabitExtended {
    return this.convertHabitExtendedRawValueToHabitExtended(form.getRawValue() as HabitExtendedFormRawValue | NewHabitExtendedFormRawValue);
  }

  resetForm(form: HabitExtendedFormGroup, habitExtended: HabitExtendedFormGroupInput): void {
    const habitExtendedRawValue = this.convertHabitExtendedToHabitExtendedRawValue({ ...this.getFormDefaults(), ...habitExtended });
    form.reset(
      {
        ...habitExtendedRawValue,
        id: { value: habitExtendedRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): HabitExtendedFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      habitCompletionCheckbox: false,
      habitDate: currentTime,
    };
  }

  private convertHabitExtendedRawValueToHabitExtended(
    rawHabitExtended: HabitExtendedFormRawValue | NewHabitExtendedFormRawValue
  ): IHabitExtended | NewHabitExtended {
    return {
      ...rawHabitExtended,
      habitDate: dayjs(rawHabitExtended.habitDate, DATE_TIME_FORMAT),
    };
  }

  private convertHabitExtendedToHabitExtendedRawValue(
    habitExtended: IHabitExtended | (Partial<NewHabitExtended> & HabitExtendedFormDefaults)
  ): HabitExtendedFormRawValue | PartialWithRequiredKeyOf<NewHabitExtendedFormRawValue> {
    return {
      ...habitExtended,
      habitDate: habitExtended.habitDate ? habitExtended.habitDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
