import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ContactForm {
  oldNumber: string; // Add oldEmail property
  newNumber: string; // Add newEmail property
}

@Component({
  selector: 'app-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss'],
})
export class NumberComponent implements OnInit {
  contact: ContactForm = {
    oldNumber: '', // Initialize oldEmail property
    newNumber: '', // Initialize newEmail property
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      // Call API or perform action to reset email
    }
  }
}
