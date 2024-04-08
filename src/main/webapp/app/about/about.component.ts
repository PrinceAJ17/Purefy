import { Component, OnInit } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'jhi-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
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
}
