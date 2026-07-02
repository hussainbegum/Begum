import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminMovie, AdminService } from '../admin-service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, NgIf, NgClass],
  templateUrl: './admin-dashboard-component.html',
  styleUrls: ['./admin-dashboard-component.css']
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  // Statistics Telemetry Properties
  totalMoviesCount = 0;
  totalBookingsCount = 0;
  totalUsersCount = 0;
  
  // Review Calculation States
  averageRating = 0;
  topRatedMovieName = 'N/A';

  searchQuery = '';
  isEditing = false;
  editingId: string | null = null;
  isSubmitting = false;

  moviesList: AdminMovie[] = [];

  // Form Model matching your MongoDB document keys perfectly
  movieForm: AdminMovie = { 
    name: '', 
    language: '', 
    rating: 0, 
    image: '', 
    review: '' 
  };

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // 1. Fetching all items from MongoDB to compute real-time metrics
    this.adminService.getMovies().subscribe({
      next: (data) => {
        this.moviesList = data;
        this.totalMoviesCount = data.length;
        this.calculateReviewStats();
      },
      error: () => this.toastr.error('Failed to parse database collection entries.')
    });

    // 2. Fetching baseline operational statistics
    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.totalBookingsCount = stats.totalBookings;
        this.totalUsersCount = stats.totalUsers;
      },
      error: () => {
        // Fallback placeholders if endpoint metadata varies
        this.totalBookingsCount = 120;
        this.totalUsersCount = 50;
      }
    });
  }

  calculateReviewStats(): void {
    if (this.moviesList.length > 0) {
      const sum = this.moviesList.reduce((acc, m) => acc + (Number(m.rating) || 0), 0);
      this.averageRating = parseFloat((sum / this.moviesList.length).toFixed(1));

      const topMovie = this.moviesList.reduce((prev, current) =>
        (prev.rating > current.rating) ? prev : current
      );
      this.topRatedMovieName = topMovie.name || 'N/A';
    } else {
      this.averageRating = 0;
      this.topRatedMovieName = 'N/A';
    }
  }

  get filteredMovies(): AdminMovie[] {
    if (!this.searchQuery.trim()) {
      return this.moviesList;
    }
    return this.moviesList.filter(m => 
      (m.name?.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
      (m.language?.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
  }

  // Hitting your Backend API Call to cleanly append or update structures
  saveMovie(): void {
    if (!this.movieForm.name || !this.movieForm.language || this.movieForm.rating === undefined) {
      this.toastr.warning('Please input mandatory attributes.', 'Validation Error');
      return;
    }

    if (this.isSubmitting) return;
    this.isSubmitting = true;

    if (this.isEditing && this.editingId) {
      // Execute UPDATE via PUT mapping
      this.adminService.updateMovie(this.editingId, this.movieForm).subscribe({
        next: () => {
          this.toastr.success('Movie database item updated successfully.', 'Modified');
          this.isSubmitting = false;
          this.resetForm();
          this.loadDashboardData();
        },
        error: () => {
          this.toastr.error('Error modifying remote document structure.');
          this.isSubmitting = false;
        }
      });
    } else {
      // Execute SAVE via POST matching your exact '/save' routing block
      // From your admin-dashboard.component.ts file:
this.adminService.addMovie(this.movieForm).subscribe({
  next: () => {
    this.toastr.success('New movie entry saved into MongoDB registries.', 'Success');
    this.isSubmitting = false;
    this.resetForm();            // Wipes the inputs clean for the next entry
    this.loadDashboardData();    // Re-hits GET /api/movies to refresh your UI table
  },
  error: () => {
    this.toastr.error('Could not append movie metadata model.');
    this.isSubmitting = false;
  }
});
    }
  }

  editMovie(movie: AdminMovie): void {
    this.isEditing = true;
    this.editingId = movie.id || movie._id || null;
    this.movieForm = { ...movie };
  }

  deleteMovie(id: string | undefined): void {
    if (!id) return;
    if (confirm('Are you completely sure you want to permanently delete this movie record?')) {
      this.adminService.deleteMovie(id).subscribe({
        next: () => {
          this.toastr.info('Collection record cleared.', 'Purged');
          this.loadDashboardData();
        },
        error: () => this.toastr.error('Database dropped execution criteria.')
      });
    }
  }

  resetForm(): void {
    this.movieForm = { 
      name: '', 
      language: '', 
      rating: 0, 
      image: '', 
      review: '' 
    };
    this.isEditing = false;
    this.editingId = null;
    this.isSubmitting = false;
  }

  logout(): void {
    this.toastr.info('Terminal session logged out.');
    this.router.navigate(['/login']);
  }
}