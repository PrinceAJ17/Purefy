import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ContactForm {
  email: string; // Add email property
  oldPassword: string;
  newPassword: string;
}

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements OnInit {
  contact: ContactForm = {
    email: '', // Initialize email property
    oldPassword: '',
    newPassword: '',
  };

  errorMessage: string; // Define errorMessage property

  constructor(private http: HttpClient) {
    this.errorMessage = ''; // Initialize errorMessage property
  }

  ngOnInit(): void {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      // Call API or perform action to reset password
    }
  }
}
