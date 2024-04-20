import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { PasswordResetInitService } from './password-reset-init.service';
import { UserService } from '../../../entities/user/user.service';
import { AccountService } from '../../../core/auth/account.service';

@Component({
  selector: 'jhi-password-reset-init',
  templateUrl: './password-reset-init.component.html',
})
export class PasswordResetInitComponent implements AfterViewInit {
  @ViewChild('email', { static: false })
  email?: ElementRef;

  success = false;
  resetRequestForm = this.fb.group({
    email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
  });
  email2: string | undefined;
  error: Boolean | undefined;
  resetUrl: string | undefined;

  constructor(
    private passwordResetInitService: PasswordResetInitService,
    private fb: FormBuilder,
    private accountService: AccountService
  ) {}

  ngAfterViewInit(): void {
    if (this.email) {
      this.email.nativeElement.focus();
    }
  }

  requestReset(): void {
    this.passwordResetInitService.save(this.resetRequestForm.get(['email'])!.value).subscribe(() => (this.success = true));
  }

  resetPassword(): void {
    this.passwordResetInitService.save(this.resetRequestForm.get(['email'])!.value).subscribe(
      activationKey => {
        if (activationKey) {
          console.log('Activation Key:', activationKey);
          this.success = true;
          this.resetUrl = 'http://team13.bham.team/account/reset/finish?key=' + activationKey;
        } else {
          console.error('No activation key returned.');
        }
      },
      error => console.error('Reset password error:', error)
    );
  }
}
