import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiRequestService {
  private http: HttpClient = inject(HttpClient);
  request<T>(
    method: 'POST' | 'GET' | 'PUT' | 'DELETE',
    url: string,
    body?: any
  ): Observable<T> {
    const fullUrl = `${environment.apiUrl}${url}`;
    return this.http
      .request(method, fullUrl, {
        body: method === 'GET' || method === 'DELETE' ? undefined : body,
        
      })
      .pipe(
        catchError((error) => {
          console.log(error);
          return of(error);
        })
      );
  }
}
