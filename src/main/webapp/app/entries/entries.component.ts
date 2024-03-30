import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { EntriesFeatureService } from '../entities/entries-feature/service/entries-feature.service'; // Adjust the path as necessary
import { EntriesFeature } from '../entities/entries-feature/entries-feature.module'; // Adjust the path as necessary

@Component({
  selector: 'jhi-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss'],
})
export class EntriesComponent implements OnInit {
  entryFeature: EntriesFeature = new EntriesFeature(); // Adjust based on your actual model
  entries: EntriesFeature[] = []; // Store fetched entries

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
    this.entriesFeatureService.create(this.entryFeature).subscribe({
      next: res => {
        console.log('Entry saved:', res);
        this.closePopup(); // Close the popup on successful save
      },
      error: err => console.error('Error saving entry:', err),
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
}
