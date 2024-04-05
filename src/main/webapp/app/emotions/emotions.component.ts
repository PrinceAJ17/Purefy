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
  prompts: PromptsFeature[] = [];
  filteredPromptedEntries: PromptsFeature[] = [];
  searchTerm: string = '';
  private renderer: Renderer2;

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
    this.filteredPromptedEntries = this.prompts;
  }

  ngAfterViewInit() {
    (window as any).emotionsComponent = this;
  }

  loadPromptedEntries(): void {
    this.promptsFeatureService.getAll().subscribe((data: PromptsFeature[]) => {
      this.prompts = data.sort((a: PromptsFeature, b: PromptsFeature) => {
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

  savePromptedEntry(): void {
    const { id, ...submissionPrompt } = this.promptFeature;
    this.promptsFeatureService.create(submissionPrompt as NewPromptsFeature).subscribe({
      next: (res: HttpResponse<PromptsFeature>) => {
        console.log('Prompted entry saved:', res.body);
        if (res.body) {
          this.prompts.push(res.body);
          this.filteredPromptedEntries = this.prompts;
          this.resetForm();
        }
      },
      error: err => console.error('Error saving prompted entry:', err),
      complete: () => {
        alert('Prompted entry saved successfully!');
      },
    });
  }

  setPrompt(prompt: string): void {
    this.renderer.setProperty(this.promptFeature, 'prompt', prompt);
  }

  resetForm(): void {
    this.promptFeature = {
      id: 0,
      title: null,
      prompt: null,
      content: null,
      date: null,
    };
  }
}
