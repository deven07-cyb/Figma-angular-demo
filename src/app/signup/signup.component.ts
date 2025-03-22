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
    if (this.signupForm.invalid) {
      // Mark all fields as touched to trigger validation errors
      Object.keys(this.signupForm.controls).forEach(key => {
        const control = this.signupForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    // Form is valid, proceed with submission
    console.log('Form Submitted', this.signupForm.value);
    // Here you would typically call your API service to register the user
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.hidePassword = !this.hidePassword;
    } else {
      this.hideConfirmPassword = !this.hideConfirmPassword;
    }
  }

  onVideoOptionChange(option: string): void {
    this.videoUploadOption = option;
    // Reset the file field when switching between upload options
    this.signupForm.get('introVideo')?.setValue('');
  }
}