import { Component } from '@angular/core';
import {Router} from '@angular/Router'

@Component({
  selector: 'jhi-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  constructor(private router: Router) {}
}
