import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

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
