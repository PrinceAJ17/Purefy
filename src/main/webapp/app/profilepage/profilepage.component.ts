import { Component, OnInit } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'jhi-profilepage',
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.scss'],
})
export class ProfilepageComponent implements OnInit {
  fontSizeMultiplier: number = 1;
  account$?: Observable<Account | null>;
  currentUsername?: string;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.account$ = this.accountService.identity();
    this.account$.subscribe(account => {
      if (account) {
        this.currentUsername = account.login;
        // Use username-specific key to fetch font size
        const storedFontSize = localStorage.getItem(this.getFontSizeKey());
        if (storedFontSize) {
          this.fontSizeMultiplier = parseFloat(storedFontSize);
        }
      }
    });
  }

  getFontSizeKey(): string {
    // Ensure there's a default key if username is not yet available
    return `fontSizeMultiplier_${this.currentUsername || 'default'}`;
  }

  updateFontSize(): void {
    // Save font size to local storage with username-specific key
    localStorage.setItem(this.getFontSizeKey(), this.fontSizeMultiplier.toString());
  }

  currentImageIndex: number = 0;
  images: string[] = ['../assets/images/dopamine1.jpg', '../assets/images/dopmine2.jpg'];

  toggleImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  capitalizeFirstLetter(username: string): string {
    return username.charAt(0).toUpperCase() + username.slice(1);
  }

  getCurrentImage(): string {
    return this.images[this.currentImageIndex];
  }
}
