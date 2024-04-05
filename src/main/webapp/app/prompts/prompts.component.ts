import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { PromptsFeatureService } from '../entities/prompts-feature/service/prompts-feature.service';
import { PromptsFeature, NewPromptsFeature } from '../entities/prompts-feature/prompts-feature.model';
import { default as dayjs } from 'dayjs';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-prompts',
  templateUrl: './prompts.component.html',
  styleUrls: ['./prompts.component.scss'],
})
export class PromptsComponent implements OnInit {
  promptFeature: PromptsFeature = {
    id: 0,
    title: null,
    prompt: null,
    content: null,
    date: null,
  };
  prompts: PromptsFeature[] = [];
  filteredPromptedEntries: PromptsFeature[] = [];
  searchTerm: string = '';

  formatDate(date: string | dayjs.Dayjs | null | undefined): string | null {
    if (!date) return null;
    const formattedDate = dayjs(date).isValid() ? dayjs(date) : dayjs();
    return formattedDate.toDate().toISOString();
  }

  constructor(private router: Router, private renderer: Renderer2, private promptsFeatureService: PromptsFeatureService) {}

  ngOnInit(): void {
    this.loadScript('vendor/jquery/jquery.min.js')
      .then(() => this.loadScript('vendor/bootstrap/js/bootstrap.min.js'))
      .then(() => this.loadScript('assets/js/tabs.js'))
      .then(() => this.loadScript('assets/js/popup.js'))
      .then(() => this.loadScript('assets/js/custom.js'))
      .then(() => this.loadScript('assets/js/MoodJournal.js'))
      .then(() => {
        console.log('All scripts loaded successfully');
      })
      .catch(error => {
        console.error('Script loading error:', error);
      });
    this.loadPromptedEntries();
    this.filteredPromptedEntries = this.prompts;
  }

  loadPromptedEntries(): void {
    this.promptsFeatureService.getAll().subscribe((data: PromptsFeature[]) => {
      this.prompts = data.sort((a, b) => {
        const dateA = dayjs(a.date);
        const dateB = dayjs(b.date);
        return dateB.valueOf() - dateA.valueOf(); // Sort in descending order
      });
      this.filteredPromptedEntries = this.prompts;
    });
  }

  private loadScript(scriptUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const body = document.body as HTMLDivElement;
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = false;
      script.onload = () => resolve();
      script.onerror = error => reject(error);
      body.appendChild(script);
    });
  }

  deletePromptedEntry(id: number): void {
    if (confirm('Are you sure you want to delete this prompt?')) {
      this.promptsFeatureService.delete(id).subscribe(
        () => {
          this.prompts = this.prompts.filter(prompt => prompt.id !== id);
          this.filteredPromptedEntries = this.filteredPromptedEntries.filter(prompt => prompt.id !== id);
          console.log('Prompt deleted successfully');
        },
        error => {
          console.error('Error deleting prompt:', error);
        }
      );
    }
  }

  filterPromptedEntries(): void {
    this.filteredPromptedEntries = this.prompts.filter(
      prompt =>
        prompt.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        prompt.content?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Method to open the prompt popup
  openPromptPopup(): void {
    const popup = document.getElementById('addPromptPopup');
    if (popup) {
      this.renderer.setStyle(popup, 'display', 'block');
    }
  }

  // Method to close the prompt popup
  closePromptPopup(): void {
    const popup = document.getElementById('addPromptPopup');
    if (popup) {
      this.renderer.setStyle(popup, 'display', 'none');
    }
  }
}
