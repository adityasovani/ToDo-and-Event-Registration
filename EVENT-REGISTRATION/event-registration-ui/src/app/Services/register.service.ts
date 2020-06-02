import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Registration } from '../Model/Registration';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  url: string = 'https://event-registration-back-end.herokuapp.com'

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  register(registration: Registration): Observable<Registration> {
    return this.http.post<Registration>(`${this.url}/users/register`, registration, this.httpOptions)
  }

  confirm(id: string):Observable<Registration> {
    return this.http.get<Registration>(`${this.url}/users/confirm/${id}`, this.httpOptions)
  }
}
