import { Component, OnInit, Renderer2, RendererFactory2, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PromptsFeatureService } from '../entities/prompts-feature/service/prompts-feature.service';
import { PromptsFeature, NewPromptsFeature } from '../entities/prompts-feature/prompts-feature.model';
import { default as dayjs } from 'dayjs';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-emotions',
  templateUrl: './emotions.component.html',
  styleUrls: ['./emotions.component.scss'],
})
export class EmotionsComponent implements OnInit, AfterViewInit {
  promptFeature: PromptsFeature = {
    id: 0,
    title: null,
    prompt: null,
    content: null,
    date: null,
  };
  allPrompts: PromptsFeature[] = [];
  filteredPromptedEntries: PromptsFeature[] = [];
  searchTerm: string = '';
  private renderer: Renderer2;

  // Array of prompts
  promptOptions: { prompt: string }[] = [
    { prompt: 'How does your sadness manifest in your thoughts, body, and relationships?' },
    { prompt: 'Reflect on a recent experience of sadness. What triggered it, and how did you cope?' },
    { prompt: 'What messages might your sadness be trying to communicate to you?' },
    { prompt: 'How can you reframe your sadness as an opportunity for personal growth and resilience?' },
    { prompt: 'Identify three things that bring you comfort or joy during moments of sadness.' },
    { prompt: 'Contemplate a moment when sadness felt overwhelming. How did you find light in that darkness?' },
  ];

  constructor(private router: Router, private rendererFactory: RendererFactory2, private promptsFeatureService: PromptsFeatureService) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  ngOnInit(): void {
    this.loadScript('vendor/jquery/jquery.min.js')
      .then(() => this.loadScript('vendor/bootstrap/js/bootstrap.min.js'))
      .then(() => this.loadScript('assets/js/isotope.min.js'))
      .then(() => this.loadScript('assets/js/owl-carousel.js'))
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
    this.filteredPromptedEntries = this.allPrompts;
  }

  ngAfterViewInit() {
    (window as any).emotionsComponent = this;
  }

  loadPromptedEntries(): void {
    this.promptsFeatureService.getAll().subscribe((data: PromptsFeature[]) => {
      this.allPrompts = data.sort((a: PromptsFeature, b: PromptsFeature) => {
        const dateA = dayjs(a.date);
        const dateB = dayjs(b.date);
        return dateB.valueOf() - dateA.valueOf(); // Sort in descending order
      });
      this.filteredPromptedEntries = this.allPrompts;
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

  savePromptedEntry(): void {
    const { id, ...submissionPrompt } = this.promptFeature;
    this.promptsFeatureService.create(submissionPrompt as NewPromptsFeature).subscribe({
      next: (res: HttpResponse<PromptsFeature>) => {
        console.log('Prompted entry saved:', res.body);
        if (res.body) {
          this.allPrompts.push(res.body);
          this.filteredPromptedEntries = this.allPrompts;
          this.resetForm(); // Reset the form
          this.router.navigate(['/Prompts']); // Redirect to prompts page
        }
      },
      error: err => console.error('Error saving prompted entry:', err),
      complete: () => {
        alert('Prompted entry submitted successfully! You will now be redirected to the Prompts page to view your entry.');
        this.router.navigate(['/Prompts']); // Redirect to prompts page
      },
    });
  }

  setPrompt(promptIndex: number): void {
    this.promptFeature.prompt = this.promptOptions[promptIndex].prompt;
  }

  updateSelectedPrompt(promptIndex: number): void {
    this.setPrompt(promptIndex);
  }

  resetForm(): void {
    this.promptFeature = {
      id: this.promptFeature.id,
      title: null,
      prompt: null,
      content: null,
      date: null,
    };
  }
}
