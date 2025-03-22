import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,           // For ngIf, ngClass, etc.
    FormsModule,            // For template-driven forms
    ReactiveFormsModule,    // For reactive forms
    RouterLink              // For routerLink directive
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  videoUploadOption = 'upload';

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.signupForm = this.fb.group({
      userType: ['tutor', Validators.required],
      timezone: ['Asia (Kolkata)', Validators.required],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      videoOption: ['upload', Validators.required],
      introVideo: ['', Validators.required],
      verificationDoc: ['', Validators.required],
      resumeDoc: ['', Validators.required],
      additionalDoc: [''],
      termsAccepted: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  // Helper methods to check form validation
  get f() { 
    return this.signupForm.controls; 
  }

  onFileChange(event: any, controlName: string): void {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.signupForm.get(controlName)?.setValue(file);
    }
  }

onSubmit(): void {
    console.log("tttt")
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
}

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.hidePassword = !this.hidePassword;
    } else {
      this.hideConfirmPassword = !this.hideConfirmPassword;
    }
  }

onVideoOptionChange(option: string) {
    this.videoUploadOption = option;
    if (option === 'youtube') {
      this.signupForm.get('introVideo')?.setValidators([
        Validators.required,
        Validators.pattern(/^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]{11}$/)
      ]);
    } else {
      this.signupForm.get('introVideo')?.clearValidators();
    }
    this.signupForm.get('introVideo')?.updateValueAndValidity();
  }
}
