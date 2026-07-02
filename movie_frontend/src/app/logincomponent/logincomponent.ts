import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './logincomponent.html',
  styleUrls: ['./logincomponent.css']
})
export class LoginComponent {
  email = '';
  password = '';

  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  onLogin(event: Event) {
    event.preventDefault(); // Prevents the browser from reloading the page

    // 1. Validation check
    if (!this.email || !this.password) {
      this.toastr.error('Please fill out all fields!', 'Validation');
      return;
    }

    const payload = { email: this.email, password: this.password };

    // 2. HTTP POST Request to your Spring Boot Server (Port 8080)
    this.http.post('http://localhost:8080/auth/login', payload)
      .subscribe({
        next: (response: any) => {
          // Success message notification
          this.toastr.success('Login Successful! Welcome back.', 'Success');
          
          // Route user directly to the new dashboard panel
          this.router.navigate(['/dashboard']); 
        },
        error: (err) => {
          // Grabs the custom exception message sent by your UserService.java
          this.toastr.error(err.error || 'Invalid Credentials!', 'Login Failed');
        }
      });
  }
}