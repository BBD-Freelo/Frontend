import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { environment } from "../../environments/environment";
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private async createAuthorizationHeader(): Promise<HttpHeaders> {
    const token = await this.authService.getUserAccessToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  get<Response>(url: string): Observable<Response> {
    return this.http.get<Response>(`${environment.api_url}${url}`);
  }

  post<Response, Request>(url: string, body: Request): Observable<Response> {
    return this.http.post<Response>(`${environment.api_url}${url}`, body);
  }

  put<Response, Request>(url: string, body: Request): Observable<Response> {
    return this.http.put<Response>(`${environment.api_url}${url}`, body);
  }

  delete<Response>(url: string): Observable<Response> {
    return this.http.delete<Response>(`${environment.api_url}${url}`);
  }

  patch<Response, Request>(url: string, body: Request): Observable<Response> {
    return this.http.patch<Response>(`${environment.api_url}${url}`, body);
  }
}
