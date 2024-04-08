import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITrackedHabit, NewTrackedHabit } from '../tracked-habit.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITrackedHabit for edit and NewTrackedHabitFormGroupInput for create.
 */
type TrackedHabitFormGroupInput = ITrackedHabit | PartialWithRequiredKeyOf<NewTrackedHabit>;

type TrackedHabitFormDefaults = Pick<NewTrackedHabit, 'id' | 'completed'>;

type TrackedHabitFormGroupContent = {
  id: FormControl<ITrackedHabit['id'] | NewTrackedHabit['id']>;
  completed: FormControl<ITrackedHabit['completed']>;
  trackedHabitID: FormControl<ITrackedHabit['trackedHabitID']>;
  rel1: FormControl<ITrackedHabit['rel1']>;
  rel2: FormControl<ITrackedHabit['rel2']>;
};

export type TrackedHabitFormGroup = FormGroup<TrackedHabitFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TrackedHabitFormService {
  createTrackedHabitFormGroup(trackedHabit: TrackedHabitFormGroupInput = { id: null }): TrackedHabitFormGroup {
    const trackedHabitRawValue = {
      ...this.getFormDefaults(),
      ...trackedHabit,
    };
    return new FormGroup<TrackedHabitFormGroupContent>({
      id: new FormControl(
        { value: trackedHabitRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      completed: new FormControl(trackedHabitRawValue.completed),
      trackedHabitID: new FormControl(trackedHabitRawValue.trackedHabitID),
      rel1: new FormControl(trackedHabitRawValue.rel1),
      rel2: new FormControl(trackedHabitRawValue.rel2),
    });
  }

  getTrackedHabit(form: TrackedHabitFormGroup): ITrackedHabit | NewTrackedHabit {
    return form.getRawValue() as ITrackedHabit | NewTrackedHabit;
  }

  resetForm(form: TrackedHabitFormGroup, trackedHabit: TrackedHabitFormGroupInput): void {
    const trackedHabitRawValue = { ...this.getFormDefaults(), ...trackedHabit };
    form.reset(
      {
        ...trackedHabitRawValue,
        id: { value: trackedHabitRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TrackedHabitFormDefaults {
    return {
      id: null,
      completed: false,
    };
  }
}
