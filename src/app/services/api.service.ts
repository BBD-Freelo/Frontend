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
    return from(this.createAuthorizationHeader()).pipe(
      switchMap(headers => this.http.get<Response>(`${environment.api_url}${url}`, { headers }))
    );
  }


  // get<Response>(url: string): Observable<Response> {
  //   return this.http.get<Response>(`${environment.api_url}${url}`, { headers });
  // }

  post<Response, Request>(url: string, body: Request): Observable<Response> {
    return from(this.createAuthorizationHeader()).pipe(
      switchMap(headers => this.http.post<Response>(`${environment.api_url}${url}`, body, { headers }))
    );
  }

  put<Response, Request>(url: string, body: Request): Observable<Response> {
    return from(this.createAuthorizationHeader()).pipe(
      switchMap(headers => this.http.put<Response>(`${environment.api_url}${url}`, body, { headers }))
    );
  }

  delete<Response>(url: string): Observable<Response> {
    return from(this.createAuthorizationHeader()).pipe(
      switchMap(headers => this.http.delete<Response>(`${environment.api_url}${url}`, { headers }))
    );
  }

  patch<Response, Request>(url: string, body: Request): Observable<Response> {
    return from(this.createAuthorizationHeader()).pipe(
      switchMap(headers => this.http.patch<Response>(`${environment.api_url}${url}`, body, { headers }))
    );
  }

}
