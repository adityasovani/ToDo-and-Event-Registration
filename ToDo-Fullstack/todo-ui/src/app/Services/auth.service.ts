import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../Model/User';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url: string = 'https://todo-nodejs-backend.herokuapp.com'

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  login(user: User): Observable<User> {
    return this.http.post<User>(`${this.url}/auth/login`, user, this.httpOptions)
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.url}/auth/signup`, user, this.httpOptions)
  }
}
