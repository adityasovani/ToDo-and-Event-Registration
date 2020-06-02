import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../Model/User';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url: string = 'https://event-registration-back-end.herokuapp.com'

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  login(user: User): Observable<User> {
    return this.http.post<User>(`${this.url}/login`, user, this.httpOptions)
  }
}
