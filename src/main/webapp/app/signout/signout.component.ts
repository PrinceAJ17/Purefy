import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'app/login/login.service';

@Component({
  selector: 'jhi-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.scss'],
})
export class SignoutComponent implements OnInit {
  constructor(
    private loginService: LoginService, // Inject the LoginService
    private router: Router // Inject the Router for navigation
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.loginService.logout(); // Use the logout function from your LoginService
    console.log('User signed out successfully');
    this.router.navigate(['/Login']); // Navigate to home or login page after logout
  }
}
