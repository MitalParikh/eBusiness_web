import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DynamicHeaderThemeDirective } from '../shared/directives/dynamic-header-theme.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicHeaderThemeDirective],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  host: {ngSkipHydration: 'true'}
})
export class LoginComponent {
  isLoading = false;
  errorMessage = '';
  authMode: 'signin' | 'signup' = 'signin';
  email = '';
  password = '';
  confirmPassword = '';
  backgroundGradient = signal<string>('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleAuthMode(): void {
    this.authMode = this.authMode === 'signin' ? 'signup' : 'signin';
    this.errorMessage = '';
    this.password = '';
    this.confirmPassword = '';
  }

  async signInWithGoogle(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      await this.authService.signInWithGoogle();
      // Redirect to home page after successful login
      this.router.navigate(['/']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to sign in with Google';
      console.error('Login error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async signInWithEmail(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      if (this.authMode === 'signup') {
        await this.authService.createUserWithEmailAndPassword(this.email, this.password);
      } else {
        await this.authService.signInWithEmailAndPassword(this.email, this.password);
      }
      // Redirect to home page after successful login
      this.router.navigate(['/']);
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error);
      console.error('Email auth error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async resetPassword(): Promise<void> {
    if (!this.email) {
      this.errorMessage = 'Please enter your email address';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      await this.authService.resetPassword(this.email);
      this.errorMessage = 'Password reset email sent. Check your inbox.';
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error);
      console.error('Password reset error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private validateForm(): boolean {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all required fields';
      return false;
    }

    if (this.authMode === 'signup' && this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return false;
    }

    return true;
  }

  private getErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No account found with this email address';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/weak-password':
        return 'Password is too weak';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      default:
        return error.message || 'An error occurred. Please try again';
    }
  }
}
