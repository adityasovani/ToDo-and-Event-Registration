import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../Model/Task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private url = 'https://todo-nodejs-backend.herokuapp.com/todo'

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  getTasks(_id: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.url}/findById/${_id}`, this.httpOptions)
  }

  getCompletedTasks(_id: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.url}/findCompletedById/${_id}`, this.httpOptions)
  }

  addTask(task: Task, _id: number): Observable<Task> {
    return this.http.post<Task>(`${this.url}/addTask/${_id}`, task, this.httpOptions)
  }

  deleteTask(_id: number, taskId: number): Observable<Task> {
    return this.http.delete<Task>(`${this.url}/delete/${_id}/${taskId}`, this.httpOptions)
  }

  completeTask(_id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.url}/complete/${_id}`, task, this.httpOptions)
  }

  incompleteTask(_id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.url}/incomplete/${_id}`, task, this.httpOptions)
  }
}
