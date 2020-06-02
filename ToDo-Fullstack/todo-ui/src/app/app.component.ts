import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NgForm } from '@angular/forms';
import { Task } from './Model/Task';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  task: Task = new Task()
  tasks: Array<Task> = []
  completedTasks: Array<Task> = []
  isLoggedIn: boolean = false

  //Flags for UI
  cheked: boolean = true

  @ViewChild('sidenav') sidenav: MatSidenav;

  ngOnInit(): void {
    this.tasks = []
    this.completedTasks = []

    if (localStorage.getItem('_user') != null) {
      this.isLoggedIn = true
    }
    else {
      this.isLoggedIn = false
      if (localStorage.getItem('tasks') != null) {

        this.tasks = JSON.parse(atob(localStorage.getItem('tasks')))
      }
      if (localStorage.getItem('archieved') != null) {

        this.completedTasks = JSON.parse(atob(localStorage.getItem('archieved')))
      }
    }
  }

  constructor(public router: Router) { }

  close(reason: string) {
    this.sidenav.close();
  }

  completeTask(index: number) {
    this.tasks[index].taskStatus = "Completed"
    this.completedTasks.push(this.tasks[index])

    this.tasks.splice(index, 1)

    localStorage.setItem('archieved', btoa(JSON.stringify(this.completedTasks)))
    localStorage.setItem('tasks', btoa(JSON.stringify(this.tasks)))

    this.ngOnInit()
  }

  incomplete(index: number) {
    this.cheked = true
    this.completedTasks[index].taskStatus = "In Progress"
    this.tasks.push(this.completedTasks[index])

    this.completedTasks.splice(index, 1)

    localStorage.setItem('archieved', btoa(JSON.stringify(this.completedTasks)))
    localStorage.setItem('tasks', btoa(JSON.stringify(this.tasks)))
  }

  addTask(form: NgForm) {
    this.tasks.push(form.value)
    localStorage.setItem('tasks', btoa(JSON.stringify(this.tasks)))
  }

  delete(index: number) {
    this.tasks.splice(index, 1)
    localStorage.setItem('tasks', btoa(JSON.stringify(this.tasks)))
  }

  viewNew() { this.tasks = JSON.parse(atob(localStorage.getItem('tasks'))).filter(task => task.taskStatus == "New") }

  viewInProgress() { this.tasks = JSON.parse(atob(localStorage.getItem('tasks'))).filter(task => task.taskStatus == "In Progress") }

  viewAll() { this.tasks = JSON.parse(atob(localStorage.getItem('tasks'))) }

  viewPersonal() { this.tasks = JSON.parse(atob(localStorage.getItem('tasks'))).filter(task => task.taskLabel == "Personal") }

  viewWork() { this.tasks = JSON.parse(atob(localStorage.getItem('tasks'))).filter(task => task.taskLabel == "Work") }

  viewShopping() { this.tasks = JSON.parse(atob(localStorage.getItem('tasks'))).filter(task => task.taskLabel == "Shopping") }

  viewOthers() { this.tasks = JSON.parse(atob(localStorage.getItem('tasks'))).filter(task => task.taskLabel == "Others") }

}
