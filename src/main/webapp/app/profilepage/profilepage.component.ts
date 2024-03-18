import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-profilepage',
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.scss'],
})
export class ProfilepageComponent {
  currentImageIndex: number = 0;
  images: string[] = ['../assets/images/dopamine1.jpg', '../assets/images/dopmine2.jpg'];

  toggleImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  getCurrentImage(): string {
    return this.images[this.currentImageIndex];
  }
}
