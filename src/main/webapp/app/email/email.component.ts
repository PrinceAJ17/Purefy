import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ContactForm {
  oldEmail: string; // Add oldEmail property
  newEmail: string; // Add newEmail property
}

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
})
export class EmailComponent implements OnInit {
  contact: ContactForm = {
    oldEmail: '', // Initialize oldEmail property
    newEmail: '', // Initialize newEmail property
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      // Call API or perform action to reset email
    }
  }
}
