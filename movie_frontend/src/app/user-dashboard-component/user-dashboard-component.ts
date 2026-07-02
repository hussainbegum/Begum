import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminMovie, AdminService } from '../admin-service'; 

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="user-dashboard">
      <h2>Available Movies</h2>
      <ul>
        <li *ngFor="let m of userMoviesList">{{ m.name || 'Untitled' }}</li>
      </ul>
      <button (click)="logout()">Logout</button>
    </div>
  `
})
export class UserDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  userMoviesList: AdminMovie[] = [];

  ngOnInit(): void {
    this.fetchAvailableMovies();
  }

  fetchAvailableMovies(): void {
    this.adminService.getMovies().subscribe({
      next: (data) => {
        this.userMoviesList = data;
      },
      error: () => {
        this.toastr.error('Could not communicate with movie registry engine.');
      }
    });
  }

  logout(): void {
    this.toastr.info('User session cleared safely.');
    this.router.navigate(['/login']);
  }
}