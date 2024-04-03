import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { EntriesFeatureService } from '../entities/entries-feature/service/entries-feature.service'; // Adjust the path as necessary
import { EntriesFeature, NewEntriesFeature } from '../entities/entries-feature/entries-feature.model'; // Adjust the path as necessary
import { default as dayjs } from 'dayjs';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss'],
})
export class EntriesComponent implements OnInit {
  entryFeature: EntriesFeature = {
    id: 0, // Assuming 0 is not a valid ID and will be replaced by the backend
    title: null,
    content: null,
    date: null, // Initialize all fields to null or their default state
  };
  entries: EntriesFeature[] = []; // Store fetched entries
  formatDate(date: string | dayjs.Dayjs | null | undefined): string | null {
    if (!date) return null; // Handle null or undefined
    const formattedDate = dayjs(date).isValid() ? dayjs(date) : dayjs(); // If date is a valid string, parse it; otherwise, create a new Dayjs object
    return formattedDate.toDate().toISOString(); // Convert to ISO string, or use toDate() for a Date object
  }
  constructor(
    private router: Router,
    private renderer: Renderer2,
    private entriesFeatureService: EntriesFeatureService // Inject your service
  ) {}

  ngOnInit(): void {
    this.loadScript('vendor/jquery/jquery.min.js')
      .then(() => this.loadScript('vendor/bootstrap/js/bootstrap.min.js'))
      .then(() => this.loadScript('assets/js/tabs.js'))
      .then(() => this.loadScript('assets/js/popup.js'))
      .then(() => this.loadScript('assets/js/custom.js'))
      .then(() => this.loadScript('assets/js/MoodJournal.js'))
      .then(() => {
        console.log('All scripts loaded successfully');
        // Initialization or callback functions that depend on these scripts can go here
      })
      .catch(error => {
        console.error('Script loading error:', error);
      });
    this.loadEntries(); // Call this method to load entries
  }
  loadEntries(): void {
    this.entriesFeatureService.getAll().subscribe((data: EntriesFeature[]) => {
      this.entries = data;
    });
  }

  private loadScript(scriptUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const body = document.body as HTMLDivElement;
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = false; // Important for sequential loading
      script.onload = () => resolve();
      script.onerror = error => reject(error);
      body.appendChild(script);
    });
  }

  saveEntry(): void {
    const { id, ...submissionEntry } = this.entryFeature;
    this.entriesFeatureService.create(submissionEntry as NewEntriesFeature).subscribe({
      next: (res: HttpResponse<EntriesFeature>) => {
        console.log('Entry saved:', res.body);
        if (res.body) {
          this.entries.push(res.body);
          this.resetForm();
          this.closePopup();
        }
      },
      error: err => console.error('Error saving entry:', err),
      complete: () => {
        // Display a success message
        alert('Entry saved successfully!');
      },
    });
  }

  // Method to open the popup
  openPopup(): void {
    const popup = document.getElementById('addEntryPopup');
    if (popup) {
      this.renderer.setStyle(popup, 'display', 'block');
    }
  }

  // Method to close the popup
  closePopup(): void {
    const popup = document.getElementById('addEntryPopup');
    if (popup) {
      this.renderer.setStyle(popup, 'display', 'none');
    }
  }

  deleteEntry(id: number): void {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.entriesFeatureService.delete(id).subscribe(
        () => {
          this.entries = this.entries.filter(entry => entry.id !== id);
          console.log('Entry deleted successfully');
        },
        error => {
          console.error('Error deleting entry:', error);
        }
      );
    }
  }

  resetForm(): void {
    // Reset entryFeature to its initial state to clear the form
    this.entryFeature = {
      id: 0, // Or as appropriate for your initial state
      title: null,
      content: null,
      date: null,
    };
  }
}
