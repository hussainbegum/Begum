import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  
  // 🌟 Your backend running on port 8080 with the /auth base path
  private apiUrl = 'http://localhost:8080/auth';

  /**
   * 🔐 SECURE LOGIN API CALL
   * Sends email and password credentials to Spring Boot for verification
   */
  login(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, payload);
  }

  /**
   * 📝 USER REGISTRATION API CALL
   * Sends new user details to be saved into your MongoDB collection
   */
  register(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload);
  }
}

