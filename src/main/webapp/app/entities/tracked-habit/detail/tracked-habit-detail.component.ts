import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrackedHabitService } from '../service/tracked-habit.service'; // Make sure the path is correct
import { ITrackedHabit } from '../tracked-habit.model';

@Component({
  selector: 'jhi-tracked-habit-detail',
  templateUrl: './tracked-habit-detail.component.html',
})
export class TrackedHabitDetailComponent implements OnInit {
  trackedHabit: ITrackedHabit | null = null;

  constructor(
    protected activatedRoute: ActivatedRoute,
    private trackedHabitService: TrackedHabitService // Inject TrackedHabitService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ trackedHabit }) => {
      this.trackedHabit = trackedHabit;
    });
  }

  toggleCompletion(trackedHabit: ITrackedHabit): void {
    if (!trackedHabit) {
      return;
    }

    // Toggle the completion status
    trackedHabit.completed = !trackedHabit.completed;

    // Update the backend
    if (trackedHabit.id) {
      this.trackedHabitService.update(trackedHabit).subscribe({
        next: () => console.log('Completion status updated'),
        error: () => {
          // Revert the toggle in case of error
          trackedHabit.completed = !trackedHabit.completed;
          console.error('Failed to update completion status');
        },
      });
    }
  }

  previousState(): void {
    window.history.back();
  }
}
