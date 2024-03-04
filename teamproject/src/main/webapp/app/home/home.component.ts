import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  reason: string;
  flipped: boolean;
}

interface WorkItem {
  image: string;
  description: string;
}

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  private readonly destroy$ = new Subject<void>();
  sidebarOpen = false;
  selectedImage: string = '';
  selectedCaption: string = '';

  contact: ContactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Ankita Dash',
      role: 'Profile Customization',
      description: "I'm the profile customization developer, encoding features that enable users to personalize their online presence.",
      reason: 'I aim to offer practical solutions that can help individuals improve their mental health and productivity.',
      flipped: false
    },
    {
      id: 2,
      name: 'Adnaan Loonat',
      role: 'Mood Picker',
      description: "I'm aiming to create a tool that allows users to express and track their emotions in an interactive way.",
      reason: 'I noticed a growing need for a space where individuals could learn to disconnect, reflect, and find peace amidst the chaos.',
      flipped: false
    },
    {
      id: 3,
      name: 'Samuel Davies-Jelly',
      role: 'Groups',
      description: 'Interested in collaboration, I am dedicated to creating the Groups feature for a better digital experience along with peers.',
      reason: 'I was inspired to create this after experiencing a transformative impact of reducing unnecessary stimuli in my own life.',
      flipped: false
    },
    {
      id: 4,
      name: 'Asa Bizenjo',
      role: 'Challenges',
      description: 'I thrive in challenging environments. So, I\'m doing the Challenges feature, creating engaging tasks to motivate users.',
      reason: 'This website isn\'t just a resource; it\'s a community platform where individuals can find encouragement and motivation.',
      flipped: false
    },
    {
      id: 5,
      name: 'Prince Alexander',
      role: 'Mood Journal',
      description: 'I am developing the Mood Journal feature which allows our users to track their emotional journey along the way.',
      reason: 'I chose to develop this website to introduce innovative and actionable solutions to combat the negative effects of digital overuse.',
      flipped: false
    },
    {
      id: 6,
      name: 'Allen Joseph',
      role: 'Habit Tracker',
      description: 'I am developing the habit tracker feature, helping users cultivate positive routines and behaviours regularly.',
      reason: 'It\'s designed to inform users about the science of dopamine and how modern habits can hijack our natural reward system.',
      flipped: false
    }
  ];

  works: WorkItem[] = [
    { image: 'happ.jpg', description: 'Enhanced Mood' },
    { image: 'improved life2.jpg', description: 'Improved Lifestyle' },
    { image: 'productivity.jpg', description: 'Increased Productivity' },
    { image: 'worklife.jpg', description: 'Healthy Balance Between Work and Life' }
  ];

  constructor(private accountService: AccountService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleFlip(memberId: number): void {
    const member = this.teamMembers.find(m => m.id === memberId);
    if (member) {
      member.flipped = !member.flipped;
    }
  }

  openModal(image: string, description: string): void {
    this.selectedImage = image;
    this.selectedCaption = description;
    document.getElementById('modal01')!.style.display = 'block';
  }

  closeModal(): void {
    document.getElementById('modal01')!.style.display = 'none';
  }

  onSubmit(): void {
    console.log('Form submitted:', this.contact);
    // Send a POST request to your backend endpoint
    this.http.post('/api/feedbacks', this.contact)
      .subscribe(
        (response) => {
          console.log('Feedback submitted successfully:', response);
          // Optionally, you can show a success message to the user
          alert('Feedback submitted successfully!');
          // Clear the form after successful submission
          this.contact = { name: '', email: '', subject: '', message: '' };
        },
        (error) => {
          console.error('Error submitting feedback:', error);
          // Optionally, you can show an error message to the user
          alert('Error submitting feedback. Please try again later.');
        }
      );
  }
}
