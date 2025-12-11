
import { Routes, CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { HomeComponent } from './components/home.component';
import { MathGraderComponent } from './components/math-grader.component';
import { ExamGeneratorComponent } from './components/exam-generator.component';
import { MockExamComponent } from './components/mock-exam.component';
import { UtilitiesComponent } from './components/utilities.component';
import { TermsComponent } from './components/terms.component';
import { AdminDashboardComponent } from './components/admin-dashboard.component';

// Guard Implementation
const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const isAuthenticated = await authService.isAuthenticated();
  
  if (isAuthenticated) {
    return true;
  } else {
    // If not logged in, show the modal and block navigation
    authService.showLoginModal.set(true);
    return false;
  }
};

export const routes: Routes = [
  { path: '', component: HomeComponent },
  // Protected Routes
  { path: 'grader', component: MathGraderComponent, canActivate: [authGuard] },
  { path: 'exam', component: ExamGeneratorComponent, canActivate: [authGuard] },
  { path: 'mock-exam', component: MockExamComponent, canActivate: [authGuard] },
  { path: 'utils', component: UtilitiesComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard] },
  
  // Public Routes
  { path: 'terms', component: TermsComponent },
  { path: '**', redirectTo: '' }
];
