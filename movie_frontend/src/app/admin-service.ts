import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminMovie {
  id?: string;
  _id?: string;
  name: string;
  language: string;
  rating: number;
  image: string;
  review: string;
}

export interface BookingItem {
  id?: string;
  _id?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  
  // API base route configurations
  private movieUrl = 'http://localhost:8080/api/movies'; 
  private bookingUrl = 'http://localhost:8080/booking'; // Port 8080 matching your BookingController

  /**
   * 📊 METRICS & STATISTICS
   */
  getDashboardStats(): Observable<{ totalMovies: number; totalBookings: number; totalUsers: number }> {
    return this.http.get<{ totalMovies: number; totalBookings: number; totalUsers: number }>(`http://localhost:8080/api/admin/stats`);
  }

  /**
   * 🎥 MOVIES COLLECTION MANAGEMENT
   */
  getMovies(): Observable<AdminMovie[]> {
    return this.http.get<AdminMovie[]>(`${this.movieUrl}`);
  }

  addMovie(movie: AdminMovie): Observable<AdminMovie> {
    return this.http.post<AdminMovie>(`${this.movieUrl}/save`, movie);
  }

  updateMovie(id: string, movie: AdminMovie): Observable<AdminMovie> {
    return this.http.put<AdminMovie>(`${this.movieUrl}/${id}`, movie);
  }

  deleteMovie(id: string): Observable<void> {
    return this.http.delete<void>(`${this.movieUrl}/${id}`);
  }

  /**
   * 🎫 BOOKINGS COLLECTION MANAGEMENT
   */
  getBookings(): Observable<BookingItem[]> {
    return this.http.get<BookingItem[]>(`${this.bookingUrl}`);
  }

  addBooking(booking: BookingItem): Observable<BookingItem> {
    return this.http.post<BookingItem>(`${this.bookingUrl}/save`, booking);
  }

  deleteBooking(id: string): Observable<void> {
    return this.http.delete<void>(`${this.bookingUrl}/${id}`);
  }
}
















































/*import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Unified movie schema interface matching your MongoDB collection layout
export interface AdminMovie {
  id?: string;
  _id?: string;
  name: string;
  language: string;
  rating: number;
  image: string;
  review: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  
  // Base resource URL pointing to your local Spring Boot API controller
  private baseUrl = 'http://localhost:8080/api/movies'; 

  /**
   * Fetches total count metrics for display cards
   */
  /*getDashboardStats(): Observable<{ totalMovies: number; totalBookings: number; totalUsers: number }> {
    return this.http.get<{ totalMovies: number; totalBookings: number; totalUsers: number }>(`http://localhost:8080/api/admin/stats`);
  }

  /**
   * Retrieves all document entries from your movies collection
   */
 /* getMovies(): Observable<AdminMovie[]> {
    return this.http.get<AdminMovie[]>(`${this.baseUrl}`);
  }

  /**
   * Targets @PostMapping("/save") to write new items to MongoDB
   */
  /*addMovie(movie: AdminMovie): Observable<AdminMovie> {
    return this.http.post<AdminMovie>(`${this.baseUrl}/save`, movie);
  }

  /**
   * Targets @PutMapping("/{id}") to modify existing document fields
   */
 /* updateMovie(id: string, movie: AdminMovie): Observable<AdminMovie> {
    return this.http.put<AdminMovie>(`${this.baseUrl}/${id}`, movie);
  }

  /**
   * Targets @DeleteMapping("/{id}") to clear items out of your collection
   */
  /*deleteMovie(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}*/