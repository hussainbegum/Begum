import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminMovie, AdminService } from '../admin-service';

// Interface matching your MongoDB Document structure for Bookings
export interface BookingItem {
  id?: string;
  _id?: string; 
  movieName: string;
  showTime: string;
  tickets: number;
  userEmail: string;
}

export interface MovieItem {
  id: number;
  title: string;
  poster: string;
  genre: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-component.html',
  styleUrls: ['./dashboard-component.css']
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private adminService = inject(AdminService);

  // Structural tab management properties
  activeTab: string = 'bookings'; 
  bookingsList: BookingItem[] = [];
  moviesList: AdminMovie[] = [];

  // Home view mock properties placeholder array
  popularMovies: MovieItem[] = [
    { id: 1, title: 'Pushpa 2', genre: 'Action / Drama', poster: '🎬' },
    { id: 2, title: 'Youth', genre: 'Drama / Romance', poster: '🎥' },
    { id: 3, title: 'Ramayanam', genre: 'Devotional (Bhakti) Film', poster: '📽' }
  ];

  // Movie Statistics State
  totalMovies = 0;
  averageRating = 0.0;
  topRatedMovieName = 'None';
  
  isSubmitting = false;
  isEditing = false;
  editingId: string | null = null;

  // Form payload instance for creating/updating movies
  movieForm: AdminMovie = { 
    name: '', 
    language: '', 
    rating: 5.0, 
    image: '', 
    review: '' 
  };

  // Booking Form rendering control variables
  showBookingForm = false;
  isSubmittingBooking = false;

  // Real-time booking intake instance
  bookingForm: BookingItem = {
    movieName: '',
    showTime: '',
    tickets: 1,
    userEmail: ''
  };

  ngOnInit(): void {
    this.loadMoviesCollection();
    this.loadBookingsCollection();
  }

  switchTab(tabName: string): void {
    this.activeTab = tabName;
    if (tabName === 'movies') {
      this.loadMoviesCollection();
    } else if (tabName === 'bookings') {
      this.loadBookingsCollection();
    }
  }

  logout(): void {
    this.toastr.info('Cleared authorization runtime session contexts.', 'Logged Out');
    this.router.navigate(['/login']);
  }

  /* ==========================================================================
     🎥 MOVIES CRUD OPERATIONS
     ========================================================================== */
  loadMoviesCollection(): void {
    this.adminService.getMovies().subscribe({
      next: (data) => { 
        this.moviesList = data; 
        this.totalMovies = data.length;
        this.calculateReviewStats();
      },
      error: () => this.toastr.error('Failed to parse remote database movie records.', 'Fetch Error')
    });
  }

  calculateReviewStats(): void {
    if (this.moviesList.length > 0) {
      const sum = this.moviesList.reduce((acc, m) => acc + (Number(m.rating) || 0), 0);
      this.averageRating = parseFloat((sum / this.moviesList.length).toFixed(1));
      
      const topMovie = this.moviesList.reduce((prev, current) => (prev.rating > current.rating) ? prev : current);
      this.topRatedMovieName = topMovie.name || 'N/A';
    } else {
      this.averageRating = 0.0;
      this.topRatedMovieName = 'None';
    }
  }

  saveMovie(): void {
    if (!this.movieForm.name || !this.movieForm.language || !this.movieForm.rating) {
      this.toastr.warning('Please input mandatory movie attributes.', 'Validation Check');
      return;
    }

    if (this.isSubmitting) return;
    this.isSubmitting = true;

    if (this.isEditing && this.editingId) {
      this.adminService.updateMovie(this.editingId, this.movieForm).subscribe({
        next: () => {
          this.toastr.success('Movie document modified successfully.', 'Database Synced');
          this.finalizeFormReset();
        },
        error: () => {
          this.toastr.error('Error rewriting movie document values.');
          this.isSubmitting = false;
        }
      });
    } else {
      this.adminService.addMovie(this.movieForm).subscribe({
        next: (savedMovie) => {
          this.toastr.success(`${savedMovie.name} saved to MongoDB collection registry.`, 'Success');
          this.finalizeFormReset();
        },
        error: () => {
          this.toastr.error('Could not append movie object to cluster mapping.');
          this.isSubmitting = false;
        }
      });
    }
  }

  editMovie(movie: AdminMovie): void {
    this.isEditing = true;
    this.editingId = movie.id || movie._id || null;
    this.movieForm = { ...movie };
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }

  deleteMovie(id: string | undefined): void {
    if (!id) {
      this.toastr.warning('Invalid target movie key.', 'Purge Warning');
      return;
    }

    if (confirm('Are you sure you want to permanently delete this movie record?')) {
      this.adminService.deleteMovie(id).subscribe({
        next: () => {
          this.toastr.info('Movie collection record dropped successfully.', 'Purged');
          this.loadMoviesCollection();
        },
        error: () => this.toastr.error('Server encountered an error dropping movie document.')
      });
    }
  }

  finalizeFormReset(): void {
    this.isSubmitting = false;
    this.resetMovieForm();
    this.loadMoviesCollection();
  }

  resetMovieForm(): void {
    this.movieForm = { name: '', language: '', rating: 5.0, image: '', review: '' };
    this.isEditing = false;
    this.editingId = null;
  }

  /* ==========================================================================
     🎫 BOOKINGS CRUD OPERATIONS
     ========================================================================== */
  loadBookingsCollection(): void {
    this.adminService.getBookings().subscribe({
      next: (data) => { 
        this.bookingsList = data as BookingItem[]; 
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Could not parse live reservation records from MongoDB.', 'API Error');
      }
    });
  }

  triggerBookingAlert(): void {
    this.showBookingForm = true;
    this.bookingForm = {
      movieName: 'Pushpa 2',
      showTime: '07:00 PM',
      tickets: 2,
      userEmail: 'admin@gmail.com'
    };
    
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  }

  closeBookingForm(): void {
    this.showBookingForm = false;
    this.resetBookingFormFields();
  }

  resetBookingFormFields(): void {
    this.bookingForm = { movieName: '', showTime: '', tickets: 1, userEmail: '' };
  }

  /**
   * 🚀 CREATE NEW BOOKING TRANSACTION DOCUMENT
   */
  submitBooking(): void {
    if (!this.bookingForm.movieName || !this.bookingForm.showTime || !this.bookingForm.userEmail || !this.bookingForm.tickets) {
      this.toastr.warning('Please input all reservation attributes.', 'Validation Check');
      return;
    }

    this.isSubmittingBooking = true;

    // We pass the form payload and handle the returned document safely
    this.adminService.addBooking(this.bookingForm).subscribe({
      next: (savedDoc: any) => {
        const doc = savedDoc as BookingItem;
        this.toastr.success(`Ticket sequence for "${doc.movieName}" successfully written to MongoDB cluster!`, 'DB Synced');
        this.isSubmittingBooking = false;
        this.closeBookingForm();
       this.loadBookingsCollection(); 
       
      },
      error: (err: unknown) => {
        console.error(err);
        this.toastr.error('Could not append booking document to database.', 'Insertion Failed');
        this.isSubmittingBooking = false;
      }
    });
  }

  deleteBooking(id: string | undefined): void {
    if (!id) {
      this.toastr.warning('Could not process operation: Missing booking document identification key.', 'Target Error');
      return;
    }

    if (confirm('Are you completely sure you want to drop this active ticket checkout booking from MongoDB?')) {
      this.adminService.deleteBooking(id).subscribe({
        next: () => {
          this.toastr.info('Booking ticket reservation canceled successfully.', 'Database Synced');
          this.loadBookingsCollection(); 
        },
        error: () => {
          this.toastr.error('Backend endpoint failed to clear your booking resource string.', 'Server Error');
        }
      });
    }
  }
}