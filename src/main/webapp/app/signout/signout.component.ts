import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.scss'],
})
export class SignoutComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  onSubmit(): void {
    // Simulate sign-out by clearing any stored user session or tokens
    // You can use localStorage, sessionStorage, or any other method for storing user data
    localStorage.removeItem('currentUser'); // Assuming 'currentUser' is used to store user data
    console.log('User signed out successfully');
    // You can also redirect the user to another page after sign-out
  }
}
