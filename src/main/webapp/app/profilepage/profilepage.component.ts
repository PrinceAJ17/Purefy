import { Component, OnInit } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'jhi-profilepage',
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.scss'],
})
export class ProfilepageComponent {
  account$?: Observable<Account | null>;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.account$ = this.accountService.identity();
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
