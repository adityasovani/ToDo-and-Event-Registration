import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Registration } from '../Model/Registration';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  url: string = 'https://event-registration-back-end.herokuapp.com'

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  findAll(): Observable<Registration[]> {
    return this.http.get<Registration[]>(`${this.url}/users/findAll`, this.httpOptions)
  }

  findOne(_id: string): Observable<Registration> {
    return this.http.get<Registration>(`${this.url}/users/findOne/${_id}`, this.httpOptions)
  }

}
